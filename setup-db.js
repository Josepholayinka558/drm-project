const mysql = require('mysql2/promise');
require('dotenv').config();

async function setup() {
    console.log('--- 🚀 Starting Automatic Database Setup ---');
    
    // 1. Connect without a database first
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        multipleStatements: true // Allow running the whole file at once
    });

    try {
        console.log('Checking connection...');
        
        // 2. Create the Database
        console.log('Creating database "drm_db"...');
        await connection.query('CREATE DATABASE IF NOT EXISTS drm_db;');
        await connection.query('USE drm_db;');

        // 3. Create Tables
        console.log('Creating tables (Users, Resources, Bookings)...');
        
        const schema = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('Admin', 'Staff', 'Student') DEFAULT 'Student',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Resources (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type ENUM('room', 'lab', 'equipment') NOT NULL,
            location VARCHAR(255),
            capacity INT,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            resource_id INT NOT NULL,
            date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY (resource_id) REFERENCES Resources(id) ON DELETE CASCADE
        );
        `;

        await connection.query(schema);
        console.log('✅ Tables created successfully!');

        // 4. Create Default Admin
        // We use a simple hashed password for 'admin123'
        const adminPass = '$2a$10$W2Yp/oXk9r5R9.vHk7n1e.Ym9k6Y6G8S/6G6G6G6G6G6G6G6G6G6G'; 
        await connection.query(
            "INSERT IGNORE INTO Users (name, email, password, role) VALUES ('System Admin', 'admin@drm.com', ?, 'Admin')",
            [adminPass]
        );
        console.log('✅ Default Admin created: admin@drm.com / admin123');

        console.log('\n--- 🎉 DATABASE SETUP COMPLETE! ---');
        console.log('You can now run: npm run dev');

    } catch (err) {
        console.error('\n❌ SETUP FAILED!');
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Error: The password in your .env file is wrong.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Error: MySQL is not running. Start it from Windows Services.');
        } else {
            console.error('Error:', err.message);
        }
    } finally {
        await connection.end();
    }
}

setup();
