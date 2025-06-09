const express = require('express');
const Shopkeeper = require('../models/Shopkeeper');  // Import the Shopkeeper model
const Login = require('../models/Login');  // Import the Login model
const Activity = require('../models/Activity'); // ✅ Add this at the top


const router = express.Router();


// Fetch all shopkeepers along with their status
router.get('/shopkeepers', async (req, res) => {
  try {
    const shopkeepers = await Shopkeeper.find();  // Fetch all shopkeepers

    const shopkeepersWithStatus = await Promise.all(
      shopkeepers.map(async (shopkeeper) => {
        const loginData = await Login.findOne({ customerId: shopkeeper._id }); // still using customerId field

        return {
          ...shopkeeper.toObject(),
          status: loginData?.status ?? 0,   // Default to 0 if not found
        };
      })
    );

    res.status(200).json(shopkeepersWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching shopkeepers' });
  }
});

// Approve or reject a shopkeeper by ID
router.put('/shopkeeper-approve-reject/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 1 = Approved, 2 = Rejected

  try {
    // Find the shopkeeper by ID
    const shopkeeper = await Shopkeeper.findById(id);
    if (!shopkeeper) {
      return res.status(404).json({ message: 'Shopkeeper not found' });
    }

    // Update the shopkeeper's status in the Shopkeeper model (optional, not mandatory)
    shopkeeper.status = status; // you can choose to add status field in Shopkeeper schema
    await shopkeeper.save();

    // Also update the status in the Login model
    await Login.findOneAndUpdate(
      { email: shopkeeper.email }, // Match by email since it's unique
      { status }, // Update the status to approved (1) or rejected (2)
      { new: true }
    );
    // ✅ After updating the Login model status
    const actionText = status === 1 ? 'Approved' : 'Rejected';
    await Activity.create({
      userEmail: shopkeeper.email,
      action: `${actionText} shopkeeper ${shopkeeper.name}`,
      timestamp: new Date(),
    });


    res.json({ message: 'Shopkeeper status updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating shopkeeper status' });
  }
});

module.exports = router;
