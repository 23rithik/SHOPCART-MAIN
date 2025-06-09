// In activitiesRoute.js
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

router.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
