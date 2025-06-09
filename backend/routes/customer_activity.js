const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Login = require('../models/Login');

// GET: Fetch all customers with status 1 or 3
router.get('/active-or-deactivated', async (req, res) => {
  try {
    const logins = await Login.find({ type: 'customer', status: { $in: [1, 3] } }).populate('customerId');
    const customers = logins.map(login => ({
      ...login.customerId._doc,
      status: login.status,
      email: login.email,
    }));
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers' });
  }
});

// PUT: Activate customer
router.put('/activate/:email', async (req, res) => {
  try {
    const { email } = req.params;
    await Login.findOneAndUpdate({ email, type: 'customer' }, { status: 1 });
    res.json({ message: 'Customer activated' });
  } catch (error) {
    res.status(500).json({ message: 'Error activating customer' });
  }
});

// PUT: Deactivate customer
router.put('/deactivate/:email', async (req, res) => {
  try {
    const { email } = req.params;
    await Login.findOneAndUpdate({ email, type: 'customer' }, { status: 3 });
    res.json({ message: 'Customer deactivated' });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating customer' });
  }
});

module.exports = router;
