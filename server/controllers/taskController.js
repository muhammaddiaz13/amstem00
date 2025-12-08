const db = require('../db');

exports.getAllTasks = async (req, res) => {
    try {
        // Ambil tasks HANYA milik user yang sedang login
        const result = await db.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil data tugas.' });
    }
};

exports.createTask = async (req, res) => {
    const { title, description, category, priority, status, due_date } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Judul tugas wajib diisi.' });
    }

    try {
        const newTask = await db.query(
            `INSERT INTO tasks (user_id, title, description, category, priority, status, due_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [req.user.id, title, description, category, priority, status, due_date]
        );
        res.status(201).json(newTask.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal membuat tugas.' });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, priority, status, due_date } = req.body;

    try {
        // Pastikan tugas itu milik user yang login
        const checkOwner = await db.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (checkOwner.rows.length === 0) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan atau bukan milik Anda.' });
        }

        const updatedTask = await db.query(
            `UPDATE tasks SET title = $1, description = $2, category = $3, priority = $4, status = $5, due_date = $6
             WHERE id = $7 RETURNING *`,
            [title, description, category, priority, status, due_date, id]
        );
        res.json(updatedTask.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal update tugas.' });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan atau bukan milik Anda.' });
        }
        res.json({ message: 'Tugas berhasil dihapus.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus tugas.' });
    }
};