const express = require('express');
const router = express.Router();
const Login = require('../models/Login'); // adjust path if needed
const Activity = require('../models/Activity');

// Change Admin Password
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find the admin login
    const adminLogin = await Login.findOne({ type: 'admin' });

    if (!adminLogin) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    // Check if current password matches
    if (adminLogin.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    // Update the password
    adminLogin.password = newPassword;
    await adminLogin.save();

     // Record the activity
    await Activity.create({
      userEmail: adminLogin.email,
      action: 'Admin changed password',
      timestamp: new Date(),
    });

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
