const Task = require('../models/Task');

// GET /api/dashboard/stats — admin only.
// Returns overall completion %, overdue count, and a per-intern breakdown.
async function getStats(req, res) {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    const now = new Date();

    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const overdue = tasks.filter((t) => t.status !== 'done' && new Date(t.dueDate) < now).length;
    const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

    // Group tasks per intern to build an efficiency summary
    const perIntern = {};
    for (const task of tasks) {
      if (!task.assignedTo) continue;
      const key = task.assignedTo._id.toString();

      if (!perIntern[key]) {
        perIntern[key] = {
          internId: key,
          name: task.assignedTo.name,
          email: task.assignedTo.email,
          totalTasks: 0,
          doneTasks: 0,
          overdueTasks: 0
        };
      }

      perIntern[key].totalTasks += 1;
      if (task.status === 'done') perIntern[key].doneTasks += 1;
      if (task.status !== 'done' && new Date(task.dueDate) < now) perIntern[key].overdueTasks += 1;
    }

    // Turn each intern's raw counts into a completion percentage
    const internSummary = Object.values(perIntern).map((intern) => ({
      ...intern,
      completionRate: intern.totalTasks === 0 ? 0 : Math.round((intern.doneTasks / intern.totalTasks) * 100)
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalTasks: total,
        doneTasks: done,
        completionRate,
        overdueCount: overdue,
        internSummary
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getStats };
