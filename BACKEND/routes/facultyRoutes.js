const express = require('express');
const { updateProfile, getProfile } = require('../controllers/facultyController');
const Faculty = require("../models/Faculty"); // Ensure Faculty model is correctly imported

const router = express.Router();

// ✅ Update faculty profile
router.post('/profile/update', updateProfile);

// ✅ Fetch faculty profile by username
router.get('/profile/:username', getProfile);

// ✅ New Route: Get Total Faculty Count
router.get('/count', async (req, res) => {
    try {
        const totalFaculty = await Faculty.countDocuments(); // Count faculty records
        res.json({ totalFaculty });
    } catch (error) {
        console.error("Error fetching faculty count:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
