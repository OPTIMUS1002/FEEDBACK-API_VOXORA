const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Aggregate statistics route (must precede /:id parameter)
router.get('/stats/summary', feedbackController.getFeedbackStats);

// Main CRUD endpoints
router.get('/', feedbackController.getAllFeedback);
router.post('/', feedbackController.createFeedback);
router.get('/:id', feedbackController.getFeedbackById);
router.put('/:id', feedbackController.updateFeedback);
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
