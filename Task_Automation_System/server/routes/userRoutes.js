const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/authMiddleware');
const { getInterns } = require('../controllers/userController');

// Admin-only: full intern roster, independent of task assignment.
router.get('/interns', protect, allowRoles('admin'), getInterns);

module.exports = router;
