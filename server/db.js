require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Wajib untuk Railway
});

pool.connect()
    .then(() => console.log('✅ Database Railway Terhubung!'))
    .catch(err => console.error('❌ Gagal Konek Database:', err.message));

module.exports = { query: (text, params) => pool.query(text, params) };