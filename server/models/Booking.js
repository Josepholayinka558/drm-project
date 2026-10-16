const pool = require('../../config/db');

const Booking = {
    getAll: async (userId = null, role = 'Student') => {
        let query = `
            SELECT b.*, u.name AS user_name, r.name AS resource_name, r.type AS resource_type
            FROM Bookings b
            JOIN Users u ON b.user_id = u.id
            JOIN Resources r ON b.resource_id = r.id
        `;
        const params = [];
        if (role !== 'Admin') {
            query += ' WHERE b.user_id = ?';
            params.push(userId);
        }
        const [rows] = await pool.query(query, params);
        return rows;
    },
    create: async (data) => {
        const { user_id, resource_id, date, start_time, end_time } = data;
        const [result] = await pool.query(
            'INSERT INTO Bookings (user_id, resource_id, date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, resource_id, date, start_time, end_time, 'Pending']
        );
        return result.insertId;
    },
    updateStatus: async (id, status) => {
        const [result] = await pool.query('UPDATE Bookings SET status = ? WHERE id = ?', [status, id]);
        return result.affectedRows;
    },
    checkConflict: async (resourceId, date, startTime, endTime) => {
        const [conflicts] = await pool.query(
            `SELECT * FROM Bookings 
             WHERE resource_id = ? 
             AND date = ? 
             AND status != 'Rejected'
             AND (
                (start_time < ? AND end_time > ?) OR
                (start_time < ? AND end_time > ?) OR
                (start_time >= ? AND end_time <= ?)
             )`,
            [resourceId, date, endTime, startTime, startTime, startTime, endTime, startTime, endTime]
        );
        return conflicts.length > 0;
    },
    getStats: async () => {
        const [totalBookings] = await pool.query('SELECT COUNT(*) as count FROM Bookings');
        const [pendingRequests] = await pool.query("SELECT COUNT(*) as count FROM Bookings WHERE status = 'Pending'");
        const [totalResources] = await pool.query('SELECT COUNT(*) as count FROM Resources');
        const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM Users');
        return {
            totalBookings: totalBookings[0].count,
            pendingRequests: pendingRequests[0].count,
            totalResources: totalResources[0].count,
            totalUsers: totalUsers[0].count
        };
    }
};

module.exports = Booking;
