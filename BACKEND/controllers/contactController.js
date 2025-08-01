const Contact = require('../models/contactModel');

// Save Contact Form Data
const saveContactData = async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            message,
        });

        await newContact.save();
        res.status(201).json({ message: 'Contact form data saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save contact form data.' });
    }
};

// Get All Contact Messages
const getAllContactMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 }); // Sort by latest first
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contact messages.' });
    }
};

module.exports = { saveContactData, getAllContactMessages };