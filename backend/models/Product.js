const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // ✅ Added category
  image: { type: String, required: true },
  shopkeeper_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Login', required: true }
});

module.exports = mongoose.model('Product', productSchema);
