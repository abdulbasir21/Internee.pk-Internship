const express = require('express');
const router = express.Router();
const { protect, isAdmin, isProjectMember } = require('../middleware/authMiddleware');
const { createMilestone, getProjectMilestones } = require('../controllers/milestoneController');

router.post('/projects/:id/milestones', protect, isAdmin, createMilestone);           // admin only
router.get('/projects/:id/milestones', protect, isProjectMember, getProjectMilestones); // members + admin

module.exports = router;
