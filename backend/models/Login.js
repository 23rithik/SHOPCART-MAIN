const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  status: Number, // 0 = pending approval, 1 = approved, etc.
  type: String,   // Type of user (e.g., 'customer', 'shopkeeper')
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },  // Reference to the Customer model
  // activity: String, // Activity description (optional)
});

module.exports = mongoose.model('Login', LoginSchema);
