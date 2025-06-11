// routes/feedbacks.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST: Customer Feedback
router.post('/customer', async (req, res) => {
  try {
    const { email, message, customer_id } = req.body;

    if (!email || !message || !customer_id) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newFeedback = new Feedback({
      email,
      message,
      type: 'customer',
      customer_id,
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error('Feedback Error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// GET: Fetch feedbacks by customer_id
router.get('/customer/:id', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      type: 'customer',
      customer_id: req.params.id,
    }).sort({ created: -1 });

    res.json(feedbacks);
  } catch (err) {
    console.error('Error fetching customer feedbacks:', err);
    res.status(500).json({ message: 'Error fetching feedbacks.' });
  }
});


module.exports = router;
