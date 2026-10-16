const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, resourceController.getResources);
router.post('/', protect, authorize('Admin'), resourceController.addResource);
router.put('/:id', protect, authorize('Admin'), resourceController.updateResource);
router.delete('/:id', protect, authorize('Admin'), resourceController.deleteResource);

module.exports = router;
