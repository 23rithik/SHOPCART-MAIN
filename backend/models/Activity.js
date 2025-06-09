const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userEmail: String,
  action: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('activities', ActivitySchema);

