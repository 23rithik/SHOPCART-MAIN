// routes/customerToShopkeeperFeedback.js
const express = require('express');
const router = express.Router();
const ShopkeeperFeedback = require('../models/feedbackShopkeeper');
const Shopkeeper = require('../models/Shopkeeper');

// POST feedback
router.post('/submit', async (req, res) => {
  try {
    const { email, message, customer_id, shopkeeper_id } = req.body;
    const feedback = new ShopkeeperFeedback({ email, message, customer_id, shopkeeper_id });
    await feedback.save();
    res.status(201).json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// GET feedbacks by customer
router.get('/by-customer/:customer_id', async (req, res) => {
  try {
    const feedbacks = await ShopkeeperFeedback.find({ customer_id: req.params.customer_id })
      .populate('shopkeeper_id', 'shopname name');
    res.json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// GET all shopkeepers
router.get('/shopkeepers', async (req, res) => {
  try {
    const shopkeepers = await Shopkeeper.find();
    res.json({ success: true, shopkeepers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shopkeepers' });
  }
});

module.exports = router;