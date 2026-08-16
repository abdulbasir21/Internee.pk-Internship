const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

router.post('/signup', signup); // intern only — role is forced server-side
router.post('/login', login);   // admin + intern

module.exports = router;
