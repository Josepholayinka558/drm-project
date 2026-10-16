const pool = require('../../config/db');

const Resource = {
    getAll: async (type = null) => {
        let query = `
            SELECT r.*, 
            (SELECT COUNT(*) FROM Bookings b 
             WHERE b.resource_id = r.id 
             AND b.date = CURDATE() 
             AND b.status = 'Approved' 
             AND CURTIME() BETWEEN b.start_time AND b.end_time) as is_currently_booked
            FROM Resources r
        `;
        const params = [];
        if (type) {
            query += ' WHERE r.type = ?';
            params.push(type);
        }
        const [rows] = await pool.query(query, params);
        return rows;
    },
    create: async (data) => {
        const { name, type, location, capacity, description } = data;
        const [result] = await pool.query(
            'INSERT INTO Resources (name, type, location, capacity, description) VALUES (?, ?, ?, ?, ?)',
            [name, type, location, capacity, description]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const { name, type, location, capacity, description } = data;
        const [result] = await pool.query(
            'UPDATE Resources SET name = ?, type = ?, location = ?, capacity = ?, description = ? WHERE id = ?',
            [name, type, location, capacity, description, id]
        );
        return result.affectedRows;
    },
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM Resources WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Resource;
