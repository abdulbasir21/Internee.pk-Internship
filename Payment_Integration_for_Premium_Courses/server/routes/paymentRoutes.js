const express = require('express');
const { createCheckoutSession } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Student must be logged in — we use req.user.email and req.user._id
router.post('/stripe/create-session', protect, createCheckoutSession);

module.exports = router;
