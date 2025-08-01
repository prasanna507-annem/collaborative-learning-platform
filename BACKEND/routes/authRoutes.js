const express = require("express");
const router = express.Router();
const {
    sendOTP,
    verifyOTP,
    resetStudentPassword,
    resetFacultyPassword
} = require("../controllers/authController");

// **🔹 Authentication Routes**
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// **🔹 Password Reset Routes**
router.post("/student/reset-password", resetStudentPassword);
router.post("/faculty/reset-password", resetFacultyPassword);

module.exports = router;
