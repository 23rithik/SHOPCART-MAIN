const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const Shopkeeper = require('../models/Shopkeeper'); // direct import of model

// GET shopkeeper name by token
router.get('/shopkeeper/me', verifyToken, async (req, res) => {
  try {
    const shopkeeperId = req.user.customerId; // make sure 'id' is present in JWT token
    const shopkeeper = await Shopkeeper.findById(shopkeeperId).select('name');

    if (!shopkeeper) {
      return res.status(404).json({ message: 'Shopkeeper not found' });
    }

    res.json({ name: shopkeeper.name });
  } catch (error) {
    console.error('Error fetching shopkeeper:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
