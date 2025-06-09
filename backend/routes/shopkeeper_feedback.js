const express  = require('express');
const router   = express.Router();
const Feedback = require('../models/Feedback');

// GET all shopkeeper feedback
router.get('/', async (_req, res) => {
  try {
    const data = await Feedback.find({ type: 'shopkeeper' }).sort({ created: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Server error fetching shopkeeper feedback' });
  }
});

// POST new shopkeeper feedback
// POST new shopkeeper feedback
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
