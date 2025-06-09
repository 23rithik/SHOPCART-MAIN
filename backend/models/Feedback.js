const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    email:   { type: String, required: true },
    message: { type: String, required: true },
    type:    { type: String, enum: ['customer', 'shopkeeper'], required: true },
    reply:   { type: String, default: '' },
    created: { type: Date, default: Date.now },

    // Optional: Link to customer or shopkeeper
    shopkeeper_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sregs',
      required: function () {
        return this.type === 'shopkeeper';
      },
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customers',
      required: function () {
        return this.type === 'customer';
      },
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
