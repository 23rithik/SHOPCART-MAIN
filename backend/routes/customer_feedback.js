const express  = require('express');
const router   = express.Router();
const Feedback = require('../models/Feedback');
const path = require('path');
const ShopkeeperFeedback = require('../models/Feedback');
const verifyToken = require('../middleware/auth'); // adjust path if needed


// GET all customer feedback (latest first)
router.get('/', async (_req, res) => {
  try {
    const data = await Feedback.find({ type: 'customer' }).sort({ created: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching customer feedback' });
  }
});


// GET feedbacks for logged-in shopkeeper
router.get('/myfeedbacks', verifyToken, async (req, res) => {
  try {
    console.log('Fetching feedbacks for shopkeeper ID:', req.user.customerId);
    const feedbacks = await ShopkeeperFeedback.find({ shopkeeper_id: req.user.customerId });
    console.log('Feedbacks fetched successfully:', feedbacks);
    res.json({ feedbacks });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { email, message, shopkeeper_id } = req.body;
    const doc = await Feedback.create({
      email,
      message,
      type: 'shopkeeper',
      shopkeeper_id,
    });
    res.status(201).json(doc);
  } catch {
    res.status(400).json({ error: 'Invalid feedback payload' });
  }
});


// PUT admin reply
router.put('/reply/:id', async (req, res) => {
  try {
    const { reply } = req.body;
    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      { reply },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Feedback not found' });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

module.exports = router;
