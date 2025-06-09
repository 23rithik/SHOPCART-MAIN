const express = require('express');
const Login = require('../models/Login');
const Customer = require('../models/Customer');
const Shopkeeper = require('../models/Shopkeeper');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email in the login collection
    const user = await Login.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the status is approved (1)
    if (user.status === 0) {
        return res.status(403).json({ message: 'You are not approved by admin.' });
      } else if (user.status === 2) {
        return res.status(403).json({ message: 'You are rejected by admin.' });
      } else if (user.status === 3) {
        return res.status(403).json({ message: 'Your account is not accessible. Deactivated by admin.' });
      }
      

    // Compare plain text password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Get user details based on the type
    let userDetails;
    if (user.type === 'customer') {
      userDetails = await Customer.findById(user.customerId);
    } else if (user.type === 'shopkeeper') {
      userDetails = await Shopkeeper.findById(user.customerId);
    }

    // Create JWT token
     const token = jwt.sign(
      {
        customerId: user.customerId,
        type: user.type,
        email: user.email
      },
      process.env.JWT_SECRET || 'ammachu2002',
      { expiresIn: '1h' }
    );

    // console.log('Token:', token);

    // Send the token and user details in response
    return res.json({ token, user: userDetails, type: user.type });

  } catch (err) {
    console.error('Backend error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
