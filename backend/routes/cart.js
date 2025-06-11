// routes/cart.js

const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// POST /api/cart/add
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const customerId = req.user.customerId;

    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (quantity > product.quantity) {
      return res.status(400).json({ message: `Only ${product.quantity} items in stock` });
    }

    const existingItem = await Cart.findOne({ customerId, productId });
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.quantity) {
        return res.status(400).json({ message: `Cannot add more than ${product.quantity} items` });
      }
      existingItem.quantity = newQuantity;
      await existingItem.save();
      return res.json({ message: 'Cart updated', cartItem: existingItem });
    }

    const cartItem = new Cart({
      customerId,
      productId,
      quantity,
    });
    await cartItem.save();
    res.status(201).json({ message: 'Product added to cart', cartItem });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const customerId = req.user.customerId;

    const cartItems = await Cart.find({ customerId })
      .populate({
        path: 'productId',
        model: Product, // 👈 Ensures correct model reference
        select: 'name price image quantity category description', // 👈 Optional: fetch only needed fields
      });
      console.log('Cart items:', cartItems);
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /api/cart/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    if (cartItem.customerId.toString() !== req.user.customerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await cartItem.deleteOne();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Delete cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
