const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// Public routes — no auth required to reach these
router.post('/signup', signup); // intern signup only (role forced server-side)
router.post('/login', login);   // both admin & intern

module.exports = router;
