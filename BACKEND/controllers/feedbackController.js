// controllers/feedbackController.js
const Feedback = require('../models/feedback');

// Submit Feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { userName, userType, userFeedback, rating } = req.body;

        // Validate required fields
        if (!userName || !userType || !userFeedback || !rating) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Ensure userType is either "Student" or "Faculty"
        if (!['Student', 'Faculty'].includes(userType)) {
            return res.status(400).json({ error: 'Invalid user type' });
        }

        const newFeedback = new Feedback({ userName, userType, userFeedback, rating });
        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get All Feedbacks
exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete Feedback
exports.deleteFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.id;

        // Validate feedbackId
        if (!feedbackId) {
            return res.status(400).json({ error: 'Feedback ID is required' });
        }

        const feedback = await Feedback.findByIdAndDelete(feedbackId);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    submitFeedback: exports.submitFeedback,
    getAllFeedbacks: exports.getAllFeedbacks,
    deleteFeedback: exports.deleteFeedback
};