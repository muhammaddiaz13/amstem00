require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Izinkan Frontend mengakses Backend
app.use(express.json()); // Izinkan membaca data JSON dari body request

// Logging sederhana untuk debugging di Railway
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
// PENTING: Prefix '/api' harus ada karena Frontend di services/api.ts menembak ke '/api'
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Root Route (Untuk cek server nyala/mati)
app.get('/', (req, res) => {
    res.send('✅ Backend AMStem Berjalan Normal!');
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di port ${PORT}`);
});

module.exports = app;