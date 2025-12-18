const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

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

exports.googleLogin = async (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(400).json({ message: 'Token Google tidak ditemukan.' });
    }

    try {
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!googleResponse.ok) {
            const errorData = await googleResponse.json();
            console.error("Google API Error:", errorData);
            throw new Error(errorData.error_description || 'Gagal validasi token ke Google');
        }

        const data = await googleResponse.json();
        const { email, name, picture } = data;

        if (!email) {
            return res.status(400).json({ message: 'Email tidak ditemukan dari akun Google ini.' });
        }

        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        let user;

        if (userResult.rows.length > 0) {
            user = userResult.rows[0];
        } else {
            const salt = await bcrypt.genSalt(10);
            const dummyPassword = await bcrypt.hash(Math.random().toString(36) + 'google-auth' + Date.now(), salt);

            const cleanName = name.replace(/\s+/g, ''); 
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            const uniqueUsername = `${cleanName}${randomSuffix}`;

            const newUser = await db.query(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
                [uniqueUsername, email, dummyPassword]
            );
            user = newUser.rows[0];
        }

        const appToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Google Login berhasil!',
            token: appToken,
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email,
                avatar: picture 
            }
        });

    } catch (error) {
        console.error("Google Auth Controller Error:", error.message);
        res.status(401).json({ message: `Gagal verifikasi Google Login: ${error.message}` });
    }
};