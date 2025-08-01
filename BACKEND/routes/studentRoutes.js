const express = require('express');
const { updateProfile, getProfile } = require('../controllers/studentController');
const Student = require('../models/Student');

const router = express.Router();

// ✅ Update profile
router.post('/profile/update', updateProfile);

// ✅ Fetch profile by username
router.get('/profile/:username', getProfile);

// ✅ Fetch total student count with enhanced logging
router.get('/count', async (req, res) => {
  try {
    console.log("Received request for /api/student/count");
    console.log("Student model loaded:", !!Student); // Check if model is loaded
    const totalStudents = await Student.countDocuments();
    console.log("Total students:", totalStudents);
    res.status(200).json({ totalStudents });
  } catch (err) {
    console.error("Error fetching student count:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;