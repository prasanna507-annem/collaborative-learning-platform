const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, index: true, trim: true },
    password: { type: String, required: true },
    email: { type: String, default: null, trim: true, lowercase: true },  // Added lowercase transformation
    phone: { type: String, default: null, trim: true },  
    address: { type: String, default: null, trim: true }, 
    profilePic: { type: String, default: null }  // Store image URL or Base64
}, { timestamps: true });  // Adds createdAt & updatedAt fields automatically

module.exports = mongoose.model('Student', studentSchema);
