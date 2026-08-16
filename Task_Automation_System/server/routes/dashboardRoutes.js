const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/authMiddleware');
const { getStats } = require('../controllers/dashboardController');

router.get('/stats', protect, allowRoles('admin'), getStats);

module.exports = router;
