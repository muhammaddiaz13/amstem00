require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // IZINKAN FRONTEND MENGAKSES
app.use(express.json()); // IZINKAN MEMBACA JSON

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Cek status server
app.get('/', (req, res) => {
    res.send('Backend AMStem Berjalan Normal!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di port ${PORT}`);
});