const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phno: String,
  address: String,
  profilePic: String,
});

module.exports = mongoose.model('Customer', customerSchema);
