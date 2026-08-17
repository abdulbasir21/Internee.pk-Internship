const User = require('../models/User');

// GET /api/users?role=intern — admin only
// This is the endpoint the frontend (services/api.js -> usersApi.listInterns)
// has been calling all along. It never existed on the backend, so every
// request 404'd, the client's .catch() swallowed the error, and the app
// silently fell back to an empty interns list — that's why the admin
// dashboard showed 0 interns, the "add member" picker was always empty,
// and there was no way to assign anyone to a project.
//
// Query param is optional: /api/users returns everyone, /api/users?role=intern
// (what the client actually sends) returns only interns. Password is never
// selected out to the client.
const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};

    if (role) {
      if (!['admin', 'intern'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role filter' });
      }
      filter.role = role;
    }

    const users = await User.find(filter).select('-password').sort({ name: 1 });

    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
};

module.exports = { getUsers };