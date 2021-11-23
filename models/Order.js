const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  issuer: {
    type: mongoose.ObjectId,
    required: true,
  },
  items: {
    _id: 0,
    type: [
      {
        product_id: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
