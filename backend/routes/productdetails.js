const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // adjust path as needed

// GET /api/productdetails/:id - Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
