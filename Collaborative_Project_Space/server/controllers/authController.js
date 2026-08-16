const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isValidEmail, isNonEmptyString } = require('../utils/validators');

// Signs a JWT carrying the user's id and role. Role is embedded so the
// frontend can branch on it immediately without an extra lookup.
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/signup
// Intern signup only — role is never taken from the request body, it's
// hardcoded to 'intern' so nobody can self-promote to admin via the API.
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!isNonEmptyString(name) || !isValidEmail(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ success: false, message: 'Name, valid email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'intern' // forced — never trust the client for this
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

// POST /api/auth/login
// Works for both admin and intern — the account's stored role decides
// what the returned token can do.
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ success: false, message: 'Valid email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

module.exports = { signup, login };
