const pool = require('../../config/db');

const User = {
    findByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        return rows[0];
    },
    create: async (userData) => {
        const { name, email, password, role } = userData;
        const [result] = await pool.query(
            'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role]
        );
        return result.insertId;
    }
};

module.exports = User;
