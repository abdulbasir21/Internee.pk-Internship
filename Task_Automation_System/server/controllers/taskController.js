const Task = require('../models/Task');
const User = require('../models/User');
const { isNonEmptyString, isValidDate } = require('../utils/validators');

// POST /api/tasks — admin only
async function createTask(req, res) {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    if (!isNonEmptyString(title) || !assignedTo || !isValidDate(dueDate)) {
      return res.status(400).json({ success: false, message: 'title, assignedTo, and a valid dueDate are required' });
    }

    const intern = await User.findById(assignedTo);
    if (!intern || intern.role !== 'intern') {
      return res.status(400).json({ success: false, message: 'assignedTo must be a valid intern id' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user._id,
      dueDate
    });

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/tasks — admin sees everything, intern sees only their own tasks
async function getTasks(req, res) {
  try {
    const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });

    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/tasks/:id — admin can view any task, intern only their own
async function getTaskById(req, res) {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const isOwner = task.assignedTo._id.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.status(200).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// PATCH /api/tasks/:id/status — intern only, and only their own task
async function updateTaskStatus(req, res) {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'in-progress', 'done'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `status must be one of ${allowedStatuses.join(', ')}` });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only update your own tasks' });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// DELETE /api/tasks/:id — admin only
async function deleteTask(req, res) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { createTask, getTasks, getTaskById, updateTaskStatus, deleteTask };
