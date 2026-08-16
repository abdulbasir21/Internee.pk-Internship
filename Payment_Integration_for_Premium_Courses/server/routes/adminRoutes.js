const express = require('express');
const Order = require('../models/Order');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/admin/orders — admin only. Lets the admin see all purchase
// activity (pending/paid/failed) without needing a separate Order UI yet.
router.get('/orders', protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'title price')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load orders' });
  }
});

module.exports = router;
