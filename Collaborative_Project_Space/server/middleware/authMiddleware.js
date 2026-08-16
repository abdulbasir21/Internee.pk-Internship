const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');

// protect: verifies the JWT and attaches the logged-in user to req.user.
// Every other middleware/route below assumes this ran first.
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = user; // available to every downstream handler
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token' });
  }
};

// isAdmin: gate for admin-only routes (create project, manage members, create milestone).
// Must run after protect.
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// isProjectMember: confirms the logged-in user is either an admin (who can
// see everything) or listed in the project's members array, before letting
// them view/edit that project's board. Must run after protect.
// Expects the project id at req.params.id OR req.params.projectId,
// whichever the route defines.
const isProjectMember = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.params.projectId;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isMember = project.members.some((memberId) => memberId.toString() === req.user._id.toString());

    if (req.user.role !== 'admin' && !isMember) {
      return res.status(403).json({ success: false, message: 'You are not a member of this project' });
    }

    req.project = project; // save a lookup in the controller
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error checking project membership' });
  }
};

module.exports = { protect, isAdmin, isProjectMember };
