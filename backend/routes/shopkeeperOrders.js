const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const verifyToken = require('../middleware/auth');
const mongoose = require('mongoose');

// GET orders for logged-in shopkeeper
router.get('/myorders', verifyToken, async (req, res) => {
  try {
    const shopkeeperId = req.user.customerId;
    console.log('Fetching orders for shopkeeper ID:', shopkeeperId);
    const products = await Product.find({ shopkeeper_id: shopkeeperId }).select('_id');
    const productIds = products.map(p => p._id);

    const orders = await Order.find({ productId: { $in: productIds } })
      .populate('productId', 'name image')
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update shipping status
router.put('/updatestatus/:id', verifyToken, async (req, res) => {
  try {
    const { shippingStatus } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { shippingStatus });
    res.json({ message: 'Shipping status updated' });
  } catch (error) {
    console.error('Error updating shipping status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;