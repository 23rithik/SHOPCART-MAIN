const express = require('express');
const router = express.Router();
const Shopkeeper = require('../models/Shopkeeper');
const Login = require('../models/Login');
const Activity = require('../models/Activity'); // Assuming Activity schema is already defined
const multer = require('multer');
const path = require('path');

// Multer storage config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/shopkeepers/'); // Store files in 'uploads/shopkeepers'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename is the timestamp to avoid collisions
  },
});

const upload = multer({ storage });

// Shopkeeper Registration Route
router.post('/register', upload.single('licenseImage'), async (req, res) => {
  try {
    const { name, shopname, email, phno, address, licenseno, password } = req.body;

    // Check if the email already exists in the Shopkeeper or Login collection
    const existingShopkeeper = await Shopkeeper.findOne({ email });
    const existingLogin = await Login.findOne({ email });

    if (existingShopkeeper || existingLogin) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Create new Shopkeeper instance
    const shopkeeper = new Shopkeeper({
      name,
      shopname,
      email,
      phno,
      address,
      licenseno,
      licenseImage: req.file.filename, // Store the filename of the uploaded license image
    });

    await shopkeeper.save(); // Save the shopkeeper details in the database

    // Create a new Login instance for the Shopkeeper
    const login = new Login({
      email,
      password,
      status: 0, // Pending approval
      type: 'shopkeeper',
      activity: 'Registered shopkeeper account',
      customerId: shopkeeper._id, // Store the shopkeeper ID as customerId
    });

    await login.save(); // Save the login details in the database

    // Log activity in the 'activities' collection
    const activity = new Activity({
      userEmail: email,
      action: 'Shopkeeper registered',
    });

    await activity.save(); // Save the activity log

    // Return success message
    res.json({ message: 'Shopkeeper registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering shopkeeper' });
  }
});

module.exports = router;
