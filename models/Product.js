const mongoose = require("mongoose");

const requiredString = {
  type: String,
  required: true,
};

const requiredInteger = {
  type: Number,
  required: true,
};

const ProductSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    unique: true,
  },
  model_id: requiredString,
  flavor: requiredString,
  number_of_puffs: requiredInteger,
  verification_code: {
    type: String,
    default: require("uuid").v4,
  },
  verificated: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
