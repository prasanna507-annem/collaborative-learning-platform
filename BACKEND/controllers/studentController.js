const Student = require('../models/Student'); // Ensure this is the correct model path

// ✅ Update Profile
async function updateProfile(req, res) {
    try {
        console.log("🔹 Received update request:", req.body); // Debug log

        const { username, name, email, phone, address, profileImage } = req.body;

        if (!username) {
            console.error("❌ Username missing in request body:", req.body);
            return res.status(400).json({ message: "Username is required!" });
        }

        // ✅ Update all provided fields
        const updateFields = { name, email, phone, address };
        if (profileImage) updateFields.profilePic = profileImage; // Ensure this matches the DB schema

        const updatedUser = await Student.findOneAndUpdate(
            { username },  
            { $set: updateFields }, // ✅ Use `$set` to update only provided fields
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            console.error(`❌ User not found for update: ${username}`);
            return res.status(404).json({ message: "User not found!" });
        }

        console.log(`✅ Profile updated for: ${username}`, updatedUser);
        res.json({ message: "Profile updated successfully!", user: updatedUser });
    } catch (error) {
        console.error("❌ Update error:", error);
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

        const user = await Student.findOne({ username });

        if (!user) {
            console.error(`❌ User not found: ${username}`);
            return res.status(404).json({ message: "User not found!" });
        }

        console.log(`✅ Profile retrieved for: ${username}`, user);
        res.json(user);
    } catch (error) {
        console.error("❌ Profile fetch error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { updateProfile, getProfile };
