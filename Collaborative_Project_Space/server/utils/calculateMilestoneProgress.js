const Task = require('../models/Task');

// Progress is always computed fresh from the Task collection rather than
// stored on the Milestone — this guarantees it can never go stale, at the
// cost of a small query each time it's requested. Fine at intern-project scale.
const calculateMilestoneProgress = async (milestoneId) => {
  const tasks = await Task.find({ milestoneId });

  const totalTasks = tasks.length;
  if (totalTasks === 0) {
    return { totalTasks: 0, doneTasks: 0, progress: 0 };
  }

  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const progress = Math.round((doneTasks / totalTasks) * 100);

  return { totalTasks, doneTasks, progress };
};

module.exports = calculateMilestoneProgress;
