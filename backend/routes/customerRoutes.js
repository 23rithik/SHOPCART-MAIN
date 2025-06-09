const express = require('express');
const Customer = require('../models/Customer');  // Import Customer model
const Login = require('../models/Login'); // Import Login model
const Activity = require('../models/Activity');
const router = express.Router();

// Fetch all customers along with their status
router.get('/customer', async (req, res) => {
  try {
    const customers = await Customer.find();  // Fetch all customers from the database

    const customersWithStatus = await Promise.all(
      customers.map(async (customer) => {
        const loginData = await Login.findOne({ customerId: customer._id });

        return {
          ...customer.toObject(),
          status: loginData?.status ?? 0,   // Attach status field (0 = pending if not found)
        };
      })
    );

    res.status(200).json(customersWithStatus);  // Return customers as a response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching customers' });  // Return error if any
  }
});

// Update customer approval/rejection status (approved/rejected)

router.put('/approve-reject/:customerId', async (req, res) => {
  const { status } = req.body;
  const { customerId } = req.params;

  if (![1, 2].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await Login.updateOne({ customerId }, { $set: { status } });

    // --- Add activity tracking here ---
    const actionDescription = status === 1 ? 'Approved customer' : 'Rejected customer';
    await Activity.create({
      userEmail: customer.email,
      action: `${actionDescription} ${customer.name}`,
      timestamp: new Date(),
    });

    res.status(200).send({ message: 'Status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error updating customer status' });
  }
});


module.exports = router;
