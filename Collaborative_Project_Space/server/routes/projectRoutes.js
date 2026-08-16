const express = require('express');
const router = express.Router();
const { protect, isAdmin, isProjectMember } = require('../middleware/authMiddleware');
const {
  createProject,
  getProjects,
  getProjectById,
  updateMembers
} = require('../controllers/projectController');

// All project routes require a logged-in user
router.use(protect);

router.post('/', isAdmin, createProject);              // admin only
router.get('/', getProjects);                           // any logged-in user
router.get('/:id', isProjectMember, getProjectById);     // members + admin
router.patch('/:id/members', isAdmin, updateMembers);    // admin only

module.exports = router;
