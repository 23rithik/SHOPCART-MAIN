const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');  // Your Mongoose model
const auth = require('../middleware/auth');      // Your auth middleware that sets req.user

// GET customer profile based on token
router.get('/profile', auth, async (req, res) => {
  try {
    const customerId = req.user.customerId;
    console.log('Fetching customer profile for ID:', customerId);
    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID not found in token' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    console.log('Customer profile fetched:', customer);
    res.json(customer);
  } catch (err) {
    console.error('Error fetching customer profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
