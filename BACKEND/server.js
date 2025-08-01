require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debugging: Log Incoming Requests
app.use((req, res, next) => {
    console.log(`📩 Incoming Request: ${req.method} ${req.url}`);
    next();
});

// Debugging: Log Route Imports
console.log("🔄 Loading Routes...");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const contactRoutes = require("./routes/contactRoutes");
const studentRoutes = require("./routes/studentRoutes");
const questionRoutes = require("./routes/questionRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const notesRouter = require("./routes/notes");

// Register Routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contactus", contactRoutes);
app.use("/api/student", studentRoutes); // Should handle /api/student/count
app.use("/api/questions", questionRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/notes", notesRouter); // Should handle /notes/count

console.log("✅ Routes loaded successfully");

// File Viewing
app.get("/view/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "uploads", filename);
    console.log("Requested filename for view:", filename);
    console.log("Full file path for view:", filePath);
    res.sendFile(filePath, { headers: { "Content-Disposition": "inline" } }, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(404).send("File not found");
        } else {
            console.log("File sent successfully:", filename);
        }
    });
});

// File Download
app.get("/download/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "uploads", filename);
    console.log("Requested filename for download:", filename);
    console.log("Full file path for download:", filePath);
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error("Error during download:", err);
            res.status(404).send("File not found");
        } else {
            console.log("File download started:", filename);
        }
    });
});

// Fetch Latest Notes (Notifications)
app.get("/notes/latest", async (req, res) => {
    try {
        const latestNote = await Note.find().sort({ createdAt: -1 }).limit(1);
        res.json(latestNote);
    } catch (err) {
        console.error("Error fetching latest note:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Handle 404 Errors
app.use((req, res) => {
    res.status(404).json({ message: "API not found" });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});