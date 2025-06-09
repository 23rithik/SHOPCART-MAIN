const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Adjust path as needed

// GET /api/products/grouped
// Returns products grouped by category
router.get('/grouped', async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find().lean();

    // Group by category
    const grouped = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching grouped products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products
// Optional query param: category to filter products by category
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    let filter = {};
    if (category) {
      filter.category = category;
    }
    const products = await Product.find(filter).lean();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
