const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'drm_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL Connected...');
        connection.release();
    } catch (err) {
        console.error('Database Connection Error:', err.message);
        // We'll let the app keep running but log the error
    }
};

connectDB();

module.exports = pool;
