const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup); // student signup only — role forced server-side
router.post('/login', login);   // works for both admin and student

module.exports = router;
