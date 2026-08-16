const express = require('express');
const router = express.Router();
const { protect, isProjectMember } = require('../middleware/authMiddleware');
const { getProjectTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

// Mounted once at /api in index.js. Full paths are written out here
// (rather than relying on a shared prefix) because this router covers two
// different URL shapes: /projects/:id/tasks (list/create, checked via
// isProjectMember) and /tasks/:id (update/delete, where the project id
// isn't in the URL, so membership is checked inside the controller instead).

router.get('/projects/:id/tasks', protect, isProjectMember, getProjectTasks);
router.post('/projects/:id/tasks', protect, isProjectMember, createTask);

router.patch('/tasks/:id', protect, updateTask);
router.delete('/tasks/:id', protect, deleteTask);

module.exports = router;
