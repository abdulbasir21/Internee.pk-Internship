const User = require('../models/User');

// GET /api/users/interns — admin only.
// Returns every registered intern (regardless of whether they have any
// tasks yet), so the admin UI can populate assign/filter dropdowns with
// the full roster instead of only interns who already have a task.
async function getInterns(req, res) {
  try {
    const interns = await User.find({ role: 'intern' })
      .select('name email createdAt')
      .sort({ name: 1 });

    res.status(200).json({ success: true, interns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getInterns };
