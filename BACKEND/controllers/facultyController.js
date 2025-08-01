const Faculty = require('../models/Faculty'); // Ensure this is the correct model path

// ✅ Update Profile
async function updateProfile(req, res) {
    try {
        console.log("🔹 Received faculty update request:", req.body); // Debug log

        const { username, name, email, phone, address, profileImage } = req.body;

        if (!username) {
            console.error("❌ Username missing in request body:", req.body);
            return res.status(400).json({ message: "Username is required!" });
        }

        // ✅ Update only provided fields
        const updateFields = { name, email, phone, address };
        if (profileImage) updateFields.profilePic = profileImage; // Ensure this matches the DB schema

        const updatedFaculty = await Faculty.findOneAndUpdate(
            { username },  
            { $set: updateFields }, // ✅ Use `$set` to update only provided fields
            { new: true, runValidators: true }
        );

        if (!updatedFaculty) {
            console.error(`❌ Faculty not found for update: ${username}`);
            return res.status(404).json({ message: "Faculty not found!" });
        }

        console.log(`✅ Faculty profile updated: ${username}`, updatedFaculty);
        res.json({ message: "Profile updated successfully!", faculty: updatedFaculty });
    } catch (error) {
        console.error("❌ Faculty update error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// ✅ Get Profile
async function getProfile(req, res) {
    try {
        const username = req.params.username || req.query.username;

        if (!username) {
            console.error("❌ No username provided in request.");
            return res.status(400).json({ message: "Username is required!" });
        }

        const faculty = await Faculty.findOne({ username });

        if (!faculty) {
            console.error(`❌ Faculty not found: ${username}`);
            return res.status(404).json({ message: "Faculty not found!" });
        }

        console.log(`✅ Faculty profile retrieved: ${username}`, faculty);
        res.json(faculty);
    } catch (error) {
        console.error("❌ Faculty profile fetch error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { updateProfile, getProfile };
