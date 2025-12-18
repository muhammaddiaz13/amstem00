require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'http://localhost:5173',                       
    'http://localhost:3000',                         
    'https://amstem.vercel.app',                     
    'https://amstem-git-amstem-willy-muhammaddiazs-projects.vercel.app', 
    'https://amstem00-production.up.railway.app' 
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('✅ Backend AMStem Berjalan Normal!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di port ${PORT}`);
});

module.exports = app;