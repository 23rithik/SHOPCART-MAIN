const mongoose = require('mongoose');

const feedbackShopkeeperSchema = new mongoose.Schema({
  email: { type: String, required: true },
  message: { type: String, required: true },
  reply: { type: String }, // no default or required
  shopkeeper_id: { type: mongoose.Schema.Types.ObjectId, ref:'Login', required: true } // no ref to Login
}, { timestamps: true });

module.exports = mongoose.model('ShopkeeperFeedback', feedbackShopkeeperSchema);
