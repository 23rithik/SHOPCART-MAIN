const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');

const Shopkeeper = require('../models/Shopkeeper');
const Login      = require('../models/Login');

// GET /api/shopkeepers - only status 1 (active) and 3 (deactivated)
// routes/shopkeeper.js

router.get('/shopkeepers/active-or-deactivated', async (_req, res) => {
  try {
    // Find logins with type 'shopkeeper' and status either 1 or 3
    const logins = await Login.find(
      { type: 'shopkeeper', status: { $in: [1, 3] } },
      'email status'
    ).lean();

    const emailToStatus = Object.fromEntries(
      logins.map(l => [l.email, l.status])
    );

    // Find shopkeepers whose emails are in that filtered login list
    const shopkeepers = await Shopkeeper.find({
      email: { $in: Object.keys(emailToStatus) }
    }).lean();

    // Merge status into shopkeeper docs
    const merged = shopkeepers.map(sk => ({
      ...sk,
      status: emailToStatus[sk.email] ?? 0
    }));

    res.json(merged);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});




/* ------------------ 2) ACTIVATE ------------------ */
router.put('/shopkeepers/activate/:email', async (req, res) => {
  await changeStatus(req, res, 1);   // Approved
});

/* ------------------ 3) DEACTIVATE ------------------ */
router.put('/shopkeepers/deactivate/:email', async (req, res) => {
  await changeStatus(req, res, 3);   // Deactivated
});

/* ------------------ shared helper ------------------ */
async function changeStatus(req, res, newStatus) {
  const { email } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // update Login
    const login = await Login.findOneAndUpdate(
      { email, type: 'shopkeeper' },
      { status: newStatus },
      { new: true, session }
    ).lean();

    if (!login) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Login not found' });
    }

    // mirror into Shopkeeper
    await Shopkeeper.updateOne(
      { email },
      { $set: { status: newStatus } },
      { session }
    );

    await session.commitTransaction();
    res.json({ status: login.status });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ error: 'Status update failed' });
  } finally {
    session.endSession();
  }
}

module.exports = router;
