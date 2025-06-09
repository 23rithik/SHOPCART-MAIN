const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Shopkeeper = require('../models/Shopkeeper');
const Activity = require('../models/Activity'); // make sure the path is correct
const Login = require('../models/Login');
const verifyToken = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/shopkeepers'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ GET profile by ID (with token check)
router.get('/profile/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.user.customerId;

  if (tokenUserId !== id) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  const shopkeeper = await Shopkeeper.findById(id).lean();
  const login = await Login.findOne({ customerId: id, type: 'shopkeeper' }).lean();

  if (!shopkeeper || !login) {
    return res.status(404).json({ message: 'Shopkeeper or login not found' });
  }

  res.json({ shopkeeper, login });
});

// ✅ UPDATE profile (with token and secure image replacement)
router.put('/edit/:id', verifyToken, upload.single('licenseImage'), async (req, res) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.user.customerId;

    if (tokenUserId !== id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const { name, shopname, email, phno, address, licenseno, password } = req.body;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (shopname) updatedData.shopname = shopname;
    if (phno) updatedData.phno = phno;
    if (address) updatedData.address = address;
    if (licenseno) updatedData.licenseno = licenseno;

    if (req.file) {
      updatedData.licenseImage = req.file.filename;

      // Delete old image
      if (req.body.oldLicenseImage) {
        const oldPath = path.join(__dirname, '..', 'uploads', 'shopkeepers', req.body.oldLicenseImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    await Shopkeeper.findByIdAndUpdate(id, updatedData);
    await Login.findOneAndUpdate({ customerId: id }, { email, password });

    // ✅ Get updated name for activity
    const shopkeeperName = updatedData.name || (await Shopkeeper.findById(id).select('name').lean()).name;

    // ✅ Add activity log
    await Activity.create({
      userEmail: email,
      action: `Shopkeeper "${shopkeeperName}" (ID: ${id}) updated their profile.`,
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
});


module.exports = router;
