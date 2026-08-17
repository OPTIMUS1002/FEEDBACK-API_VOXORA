const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Export endpoints
router.get('/export/csv', feedbackController.exportCsv);
router.get('/export/json', feedbackController.exportJson);

// Aggregate statistics route (must precede /:id parameter)
router.get('/stats/summary', feedbackController.getFeedbackStats);

// Main CRUD endpoints
router.get('/', feedbackController.getAllFeedback);
router.post('/', feedbackController.createFeedback);
router.get('/:id', feedbackController.getFeedbackById);
router.put('/:id', feedbackController.updateFeedback);
router.delete('/:id', feedbackController.deleteFeedback);

// Reactions & Faculty Replies
router.post('/:id/like', feedbackController.likeFeedback);
router.post('/:id/reply', feedbackController.replyFeedback);

module.exports = router;
