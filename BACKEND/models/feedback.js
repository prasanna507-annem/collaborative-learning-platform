const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['Student', 'Faculty'], // Restrict values to these two
        required: true
    },
    userFeedback: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
