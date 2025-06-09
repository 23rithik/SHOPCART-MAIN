const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Customer = require('../models/Customer');
const Login = require('../models/Login');
const auth = require('../middleware/auth');  // Your auth middleware to decode token and get user id

// Multer setup for profilePic upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profilePics/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// GET current customer + login data
router.get('/', auth, async (req, res) => {
  try {
    const customerId = req.user.customerId; // from auth middleware
    console.log('Fetching customer data for ID:', customerId);
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const login = await Login.findOne({ customerId });
    if (!login) return res.status(404).json({ message: 'Login details not found' });

    // Send only editable login fields
    res.json({
      customer,
      login: {
        email: login.email,
        password: login.password,  // plain text as you said
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/', auth, upload.single('profilePic'), async (req, res) => {
  try {
    const customerId = req.user.customerId;
    const { name, email, phno, address, password } = req.body;
    let profilePic;

    if (req.file) {
      profilePic = req.file.filename;

      // Delete old profile picture
      const oldCustomer = await Customer.findById(customerId);
      if (oldCustomer && oldCustomer.profilePic) {
        const oldPicPath = path.join(__dirname, '..', 'uploads', 'profilePics', oldCustomer.profilePic);
        const fs = require('fs');
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath);
        }
      }
    }

    // Update Customer
    const customerUpdate = {
      name,
      email,
      phno,
      address,
    };
    if (profilePic) {
      customerUpdate.profilePic = profilePic;
    }

    const customer = await Customer.findByIdAndUpdate(customerId, customerUpdate, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // Update Login (email and password)
    const login = await Login.findOne({ customerId });
    if (!login) return res.status(404).json({ message: 'Login details not found' });

    login.email = email;
    if (password && password.trim() !== '') {
      login.password = password;
    }
    await login.save();

    res.json({ message: 'Profile updated successfully', customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
