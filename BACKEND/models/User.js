const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  profileImage: { type: String } // Store image URL or Base64
});

// User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
