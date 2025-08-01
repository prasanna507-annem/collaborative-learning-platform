const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
require("dotenv").config();

let otpStore = {}; // Temporary storage for OTPs

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// **🔹 1. Send OTP to Email with Expiry**
exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if OTP was already sent within the last minute
    if (otpStore[email] && (Date.now() - otpStore[email].timestamp < 60000)) {
        return res.status(429).json({ success: false, message: "Please wait before requesting another OTP." });
    }

    // Generate a 6-digit OTP with expiration
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, timestamp: Date.now() }; // Store OTP with timestamp

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`
        });

        res.json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

// **🔹 2. Verify OTP with Expiry**
exports.verifyOTP = (req, res) => {
    const { email, otp } = req.body;

    if (!otpStore[email]) {
        return res.status(400).json({ success: false, message: "OTP expired or not requested." });
    }

    const { otp: storedOTP, timestamp } = otpStore[email];

    // Check if OTP is expired (5 minutes limit)
    if (Date.now() - timestamp > 5 * 60 * 1000) {
        delete otpStore[email]; // Remove expired OTP
        return res.status(400).json({ success: false, message: "OTP expired. Request a new one." });
    }

    if (storedOTP === otp) {
        delete otpStore[email]; // OTP used, remove it
        res.json({ success: true, message: "OTP verified successfully!" });
    } else {
        res.status(400).json({ success: false, message: "Invalid OTP. Try again!" });
    }
};

// **🔹 3. Reset Student Password**
exports.resetStudentPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const student = await Student.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        ).select("+password");

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error updating student password:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// **🔹 4. Reset Faculty Password**
exports.resetFacultyPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const faculty = await Faculty.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        ).select("+password");

        if (!faculty) {
            return res.status(404).json({ success: false, message: "Faculty not found" });
        }

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error updating faculty password:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
