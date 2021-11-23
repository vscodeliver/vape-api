const mongoose = require("mongoose");

const requiredString = {
  type: String,
  required: true,
};

const UserSchema = new mongoose.Schema(
  {
    email: requiredString,
    password: requiredString,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
