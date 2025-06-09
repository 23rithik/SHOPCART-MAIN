const mongoose = require('mongoose');

const ShopkeeperSchema = new mongoose.Schema({
  name: String,
  shopname: String,
  email: String,
  phno: String,
  address: String,
  licenseno: String,
  licenseImage: String, // PDF path
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('sregs', ShopkeeperSchema);
