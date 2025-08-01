const express = require('express');
const { studentSignup, facultySignup, studentLogin, facultyLogin, adminLogin } = require('../controllers/userControllers');
const Student = require('../models/Student'); // Import Student model
const router = express.Router();

// Sign Up
router.post('/student/signup', studentSignup);
router.post('/faculty/signup', facultySignup);

// Login
router.post('/student/login', studentLogin);
router.post('/faculty/login', facultyLogin);
router.post('/admin/login', adminLogin);

// New route to get student count (if you prefer this file)

module.exports = router;