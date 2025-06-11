// models/ShopkeeperFeedback.js
const mongoose = require('mongoose');

const feedbackShopkeeperSchema = new mongoose.Schema({
  email: { type: String, required: true },
  message: { type: String, required: true },
  reply: { type: String }, // optional reply
  shopkeeper_id: { type: mongoose.Schema.Types.ObjectId, ref: 'sregs', required: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Login', required: true }, // ✅ Add this
}, { timestamps: true });

module.exports = mongoose.model('ShopkeeperFeedback', feedbackShopkeeperSchema);
