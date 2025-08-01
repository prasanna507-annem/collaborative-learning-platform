// routes/feedback.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/', feedbackController.submitFeedback);    // POST /api/feedback
router.get('/', feedbackController.getAllFeedbacks);    // GET /api/feedback
router.delete('/:id', feedbackController.deleteFeedback); // DELETE /api/feedback/:id

module.exports = router;