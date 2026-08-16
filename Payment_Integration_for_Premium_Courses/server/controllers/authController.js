const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isValidEmail, isNonEmptyString } = require('../utils/validators');

// Small helper so token creation logic lives in one place.
function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/signup — students only. Role is never taken from the request
// body so a caller can't self-promote to admin.
async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!isNonEmptyString(name) || !isValidEmail(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ success: false, message: 'Name, valid email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: 'student' });

    const token = signToken(user);
    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
}

// POST /api/auth/login — works for both admin and student, since role lives on the User doc.
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ success: false, message: 'Valid email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
}

module.exports = { signup, login };
