const mysql = require('mysql2/promise');
require('dotenv').config();

const testConnection = async () => {
    console.log('--- MySQL Connection Test ---');
    console.log('Testing with:');
    console.log(`- Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`- User: ${process.env.DB_USER || 'root'}`);
    console.log(`- Password: ${process.env.DB_PASS ? '********' : '(None)'}`);
    console.log(`- Database: ${process.env.DB_NAME || 'drm_db'}`);
    console.log('------------------------------');

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'drm_db'
        });
        console.log('✅ SUCCESS: Connected to MySQL database!');
        await connection.end();
    } catch (err) {
        console.error('❌ ERROR: Could not connect to MySQL.');
        console.error('Error Message:', err.message);
        console.error('Error Code:', err.code);
        
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 Tip: Your password or username is wrong. Check your .env file.');
        } else if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('\n💡 Tip: The MySQL Service is NOT RUNNING on your computer.');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.log('\n💡 Tip: The database "drm_db" does not exist yet. Run the SQL script.');
        }
    }
};

testConnection();
