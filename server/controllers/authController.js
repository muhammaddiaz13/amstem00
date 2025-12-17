const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Pastikan GOOGLE_CLIENT_ID ada di .env backend Anda
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    try {
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'Registrasi berhasil!',
            token,
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error saat registrasi.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    try {
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Email atau Password salah.' });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email atau Password salah.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login berhasil!',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error saat login.' });
    }
};

// --- FUNGSI BARU UNTUK GOOGLE LOGIN ---
exports.googleLogin = async (req, res) => {
    const { token } = req.body;
    
    try {
        // 1. Verifikasi token dari frontend ke Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, name, sub: googleId, picture } = ticket.getPayload();

        // 2. Cek apakah email sudah ada di database
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        let user;

        if (userResult.rows.length > 0) {
            // User sudah ada, login kan saja
            user = userResult.rows[0];
            
            // Opsional: Jika Anda punya kolom google_id atau avatar_url, update di sini
            // await db.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
        } else {
            // User belum ada, buat user baru otomatis
            // Kita buat password random karena user login lewat Google
            const salt = await bcrypt.genSalt(10);
            const dummyPassword = await bcrypt.hash(Math.random().toString(36) + 'google-auth', salt);

            // Sesuaikan query INSERT di bawah jika tabel Anda memiliki kolom google_id/avatar_url
            // Jika tidak, biarkan default username, email, password
            const newUser = await db.query(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
                [name, email, dummyPassword]
            );
            user = newUser.rows[0];
        }

        // 3. Buat JWT Token aplikasi kita
        const appToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 4. Kirim respon sukses
        res.json({
            message: 'Google Login berhasil!',
            token: appToken,
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email,
                avatar_url: picture // Kirim URL foto dari Google untuk ditampilkan di frontend (jika mau)
            }
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ message: 'Gagal verifikasi Google Login.' });
    }
};