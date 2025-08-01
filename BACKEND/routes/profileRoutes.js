const express = require('express');
const router = express.Router();
const UserProfile = require('../models/User');

// Save or Update User Profile
router.post('/save', async (req, res) => {
  const { name, email, phone, address, profileImage } = req.body;

  try {
    let userProfile = await UserProfile.findOne({ email });

    if (userProfile) {
      // Update existing profile
      userProfile.name = name;
      userProfile.phone = phone;
      userProfile.address = address;
      userProfile.profileImage = profileImage;
    } else {
      // Create new profile
      userProfile = new UserProfile({ name, email, phone, address, profileImage });
    }

    await userProfile.save();
    res.status(200).json({ message: 'Profile saved successfully!', userProfile });
  } catch (error) {
    res.status(500).json({ message: 'Error saving profile', error: error.message });
  }
});

// Get User Profile by Email
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const userProfile = await UserProfile.findOne({ email });
    if (userProfile) {
      res.status(200).json(userProfile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Export the router
module.exports = router;