CREATE DATABASE IF NOT EXISTS drm_db;
USE drm_db;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Staff', 'Student') DEFAULT 'Student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources Table
CREATE TABLE IF NOT EXISTS Resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('room', 'lab', 'equipment') NOT NULL,
    location VARCHAR(255),
    capacity INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
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

-- Initial Admin (Password: admin123)
-- Hash: $2a$10$W2Yp/oXk9r5R9.vHk7n1e.Ym9k6Y6G8S/6G6G6G6G6G6G6G6G6G6G
-- Note: You should update this with a real hash later using bcrypt
-- Inserting a placeholder admin with a pre-hashed password
INSERT INTO Users (name, email, password, role) VALUES ('Admin User', 'admin@example.com', '$2a$10$TjG1Y896K3N7H8L9J0M1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E', 'Admin') ON DUPLICATE KEY UPDATE email=email;
