const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { getUsers } = require('../controllers/userController');

// All user routes require a logged-in admin — interns should not be able
// to enumerate other users, only admins picking members for a project.
router.use(protect, isAdmin);

router.get('/', getUsers); // GET /api/users  or  /api/users?role=intern

module.exports = router;