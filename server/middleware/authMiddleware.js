const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Ambil token dari header Authorization: Bearer <token>
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Simpan data user (id) ke request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token tidak valid.' });
    }
};