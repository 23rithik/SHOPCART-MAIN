const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Login = require('../models/Login');
const Activity = require('../models/Activity');
const multer = require('multer');
const path = require('path');



// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the file is stored in the 'uploads/profilePics' folder
    cb(null, 'uploads/profilePics');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp and file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Set up multer with the storage configuration
const upload = multer({ storage });

// Customer Registration Route
router.post('/register', upload.single('profilePic'), async (req, res) => {
  try {
    const { name, email, phno, address, password } = req.body;

    // Check if the email already exists in the 'customers' collection
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email already registered in customers. Please use another email.' });
    }

    // Check if the email already exists in the 'logins' collection
    const existingLogin = await Login.findOne({ email });
    if (existingLogin) {
      return res.status(400).json({ message: 'Email already registered in the system. Please use another email.' });
    }

    // Create a new customer entry
    const newCustomer = new Customer({
      name,
      email,
      phno,
      address,
      profilePic: req.file ? req.file.filename : null,  // Store the filename of the profile picture
    });

    // Save the new customer document to the database
    const savedCustomer = await newCustomer.save();

    // Create a corresponding login entry for the customer
    const newLogin = new Login({
      email,
      password,
      status: 0, // Default status (pending approval)
      type: 'customer',
      customerId: savedCustomer._id,  // Store the customerId in the login document
    });

    // Save the login document to the database
    await newLogin.save();

    // Log the activity for customer registration
    const activity = new Activity({
      userEmail: email,
      action: 'Customer registered',
    });

    await activity.save();

    // Respond with a success message
    res.json({ message: 'Customer registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering customer' });
  }
});


module.exports = router;
