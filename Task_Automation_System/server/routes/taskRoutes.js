const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/authMiddleware');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
  deleteTask
} = require('../controllers/taskController');

router.use(protect); // every task route requires a logged-in user

router.post('/', allowRoles('admin'), createTask);
router.get('/', getTasks); // role-based filtering happens inside the controller
router.get('/:id', getTaskById); // ownership checked inside the controller
router.patch('/:id/status', allowRoles('intern'), updateTaskStatus);
router.delete('/:id', allowRoles('admin'), deleteTask);

module.exports = router;
