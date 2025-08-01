const express = require('express');
const router = express.Router();
const { saveContactData, getAllContactMessages } = require('../controllers/contactController');

// POST route to handle contact form submission
router.post('/', saveContactData);

// GET route to fetch all contact messages
router.get('/', getAllContactMessages);

module.exports = router;