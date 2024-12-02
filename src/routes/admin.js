const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/users', [protect, admin], async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats (Admin only)
router.get('/stats', [protect, admin], async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const productCount = await Product.countDocuments();
    
    res.json({
      users: userCount,
      orders: orderCount,
      products: productCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;