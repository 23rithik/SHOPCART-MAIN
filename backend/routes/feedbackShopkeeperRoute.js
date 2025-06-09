const express = require('express');
const router = express.Router();
const ShopkeeperFeedback = require('../models/feedbackShopkeeper');
const verifyToken = require('../middleware/auth');
const Activity = require('../models/Activity');
const Shopkeeper = require('../models/Shopkeeper');

// 🔹 Get feedbacks for logged-in shopkeeper
router.get('/minee', verifyToken, async (req, res) => {
  try {
    console.log('Fetching feedbacks for shopkeeper ID:', req.user.customerId);
    const feedbacks = await ShopkeeperFeedback.find({ shopkeeper_id: req.user.customerId });
    console.log('Feedbacks fetched successfully:', feedbacks);
    res.json({ feedbacks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// 🔹 Reply or update a reply to a feedback
router.post('/reply/:id', verifyToken, async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || reply.trim() === '') {
      return res.status(400).json({ error: 'Reply cannot be empty' });
    }

    const feedback = await ShopkeeperFeedback.findByIdAndUpdate(
      req.params.id,
      {
        reply,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // ✅ Log activity with shopkeeper name and feedback email
    const shopkeeper = await Shopkeeper.findById(req.user.customerId);
    if (shopkeeper) {
      await Activity.create({
        userEmail: shopkeeper.email,
        action: `Shopkeeper ${shopkeeper.name} replied to feedback ${feedback.email}`
      });
    }

    res.json({ feedback });
  } catch (err) {
    console.error('Reply update failed:', err);
    res.status(500).json({ error: 'Reply failed' });
  }
});

module.exports = router;
