const express = require('express');
const router = express.Router();
const CartService = require('../services/cartService');
const { protect } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    const cart = await CartService.getCart(req.user._id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/items', [
  protect,
  check('productId', 'Product ID is required').notEmpty(),
  check('quantity', 'Quantity must be at least 1').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { productId, quantity } = req.body;
    const cart = await CartService.addItem(req.user._id, productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update item quantity
router.put('/items/:productId', [
  protect,
  check('quantity', 'Quantity must be at least 1').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await CartService.updateItemQuantity(req.user._id, productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/items/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await CartService.removeItem(req.user._id, productId);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Clear cart
router.delete('/', protect, async (req, res) => {
  try {
    const cart = await CartService.clearCart(req.user._id);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;