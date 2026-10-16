const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
    try {
        const { type } = req.query;
        const resources = await Resource.getAll(type);
        res.status(200).json(resources);
    } catch (error) {
        console.error('Get Resources Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addResource = async (req, res) => {
    try {
        const insertId = await Resource.create(req.body);
        res.status(201).json({ id: insertId, ...req.body });
    } catch (error) {
        console.error('Add Resource Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateResource = async (req, res) => {
    try {
        const affectedRows = await Resource.update(req.params.id, req.body);
        if (affectedRows === 0) return res.status(404).json({ message: 'Resource not found' });
        res.status(200).json({ message: 'Resource updated successfully' });
    } catch (error) {
        console.error('Update Resource Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteResource = async (req, res) => {
    try {
        const affectedRows = await Resource.delete(req.params.id);
        if (affectedRows === 0) return res.status(404).json({ message: 'Resource not found' });
        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Delete Resource Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
