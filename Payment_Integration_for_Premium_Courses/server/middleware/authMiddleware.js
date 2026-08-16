const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');

// protect: verifies the JWT and attaches the user to req.user.
// Every route that needs "must be logged in" uses this first.
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
}

// isAdmin: must run AFTER protect. Blocks non-admins from admin-only routes.
function isAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access only' });
  }
  next();
}

// hasPurchased: must run AFTER protect. Checks whether the logged-in student
// owns the course in req.params.id — used to gate full course content.
async function hasPurchased(req, res, next) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Free courses and admins bypass the purchase check.
    if (course.isFree || req.user.role === 'admin') {
      req.course = course;
      return next();
    }

    const owns = req.user.purchasedCourses.some(
      (id) => id.toString() === course._id.toString()
    );

    if (!owns) {
      return res.status(403).json({ success: false, message: 'Purchase required to access this course' });
    }

    req.course = course;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error checking purchase status' });
  }
}

module.exports = { protect, isAdmin, hasPurchased };
