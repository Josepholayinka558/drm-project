const Booking = require('../models/Booking');

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.getAll(req.user.id, req.user.role);
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get Bookings Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addBooking = async (req, res) => {
    const { resource_id, date, start_time, end_time } = req.body;
    try {
        const isConflict = await Booking.checkConflict(resource_id, date, start_time, end_time);
        if (isConflict) {
            return res.status(400).json({ message: 'This resource is already booked for the selected time range' });
        }

        const insertId = await Booking.create({
            user_id: req.user.id,
            resource_id,
            date,
            start_time,
            end_time
        });

        res.status(201).json({ id: insertId, status: 'Pending', ...req.body });
    } catch (error) {
        console.error('Add Booking Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    try {
        const affectedRows = await Booking.updateStatus(id, status);
        if (affectedRows === 0) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json({ message: `Booking ${status.toLowerCase()} successfully` });
    } catch (error) {
        console.error('Update Booking Status Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStats = async (req, res) => {
    try {
        const stats = await Booking.getStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Get Stats Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
