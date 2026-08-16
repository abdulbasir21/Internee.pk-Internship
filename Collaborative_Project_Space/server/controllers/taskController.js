const Task = require('../models/Task');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const { emitToProject } = require('../sockets/socketHandler');
const calculateMilestoneProgress = require('../utils/calculateMilestoneProgress');
const { isNonEmptyString, isValidStatus, isValidObjectId } = require('../utils/validators');

// Small helper: if a task is linked to a milestone, recompute that
// milestone's progress and broadcast it. Called after any save that could
// change a milestone's completion ratio (create/update/delete of a linked task).
const broadcastMilestoneIfLinked = async (milestoneId, projectId) => {
  if (!milestoneId) return;
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) return;

  const progressData = await calculateMilestoneProgress(milestoneId);
  emitToProject(projectId, 'milestone:updated', {
    milestoneId: milestone._id,
    ...progressData
  });
};

// GET /api/projects/:id/tasks — isProjectMember already confirmed access
const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching tasks' });
  }
};

// POST /api/projects/:id/tasks — any project member can create a task
const createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo, milestoneId } = req.body;
    const projectId = req.params.id;

    if (!isNonEmptyString(title)) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }
    if (status && !isValidStatus(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'todo',
      projectId,
      assignedTo: isValidObjectId(assignedTo) ? assignedTo : null,
      milestoneId: isValidObjectId(milestoneId) ? milestoneId : null
    });

    const populatedTask = await task.populate('assignedTo', 'name email');

    // REST call is the source of truth for the save; Socket.IO only
    // broadcasts the result to everyone else already viewing this board.
    emitToProject(projectId, 'task:created', populatedTask);

    if (task.milestoneId) {
      await broadcastMilestoneIfLinked(task.milestoneId, projectId);
    }

    res.status(201).json({ success: true, task: populatedTask });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error creating task' });
  }
};

// PATCH /api/tasks/:id — update title/description/assignee/status/milestone
// Not nested under a project in the URL, so we look the task up first to
// find its projectId (needed both for the membership check and the
// Socket.IO room to broadcast to).
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    const isMember = project.members.some((m) => m.toString() === req.user._id.toString());
    if (req.user.role !== 'admin' && !isMember) {
      return res.status(403).json({ success: false, message: 'You are not a member of this project' });
    }

    const { title, description, status, assignedTo, milestoneId } = req.body;

    if (status && !isValidStatus(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    // Track the OLD milestone before overwriting, so if a task moves from
    // one milestone to another, both milestones' progress get recalculated.
    const oldMilestoneId = task.milestoneId ? task.milestoneId.toString() : null;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (assignedTo !== undefined) task.assignedTo = isValidObjectId(assignedTo) ? assignedTo : null;
    if (milestoneId !== undefined) task.milestoneId = isValidObjectId(milestoneId) ? milestoneId : null;

    await task.save();
    const populatedTask = await task.populate('assignedTo', 'name email');

    emitToProject(task.projectId, 'task:updated', populatedTask);

    const newMilestoneId = task.milestoneId ? task.milestoneId.toString() : null;

    // Recompute whichever milestone(s) could have changed
    if (oldMilestoneId && oldMilestoneId !== newMilestoneId) {
      await broadcastMilestoneIfLinked(oldMilestoneId, task.projectId);
    }
    if (newMilestoneId) {
      await broadcastMilestoneIfLinked(newMilestoneId, task.projectId);
    }

    res.status(200).json({ success: true, task: populatedTask });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating task' });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    const isMember = project.members.some((m) => m.toString() === req.user._id.toString());
    if (req.user.role !== 'admin' && !isMember) {
      return res.status(403).json({ success: false, message: 'You are not a member of this project' });
    }

    const { projectId, milestoneId } = task;
    await task.deleteOne();

    emitToProject(projectId, 'task:deleted', { id: task._id });

    if (milestoneId) {
      await broadcastMilestoneIfLinked(milestoneId, projectId);
    }

    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting task' });
  }
};

module.exports = { getProjectTasks, createTask, updateTask, deleteTask };
