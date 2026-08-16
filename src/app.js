const express = require('express');
const cors = require('cors');
const path = require('path');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Serve Static Frontend Assets
app.use(express.static(path.join(__dirname, '../public')));

// API Info / Health Endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Voxora Student Feedback Platform',
    version: '2.0.0',
    endpoints: {
      getAllFeedback: 'GET /api/feedback',
      getFeedbackStats: 'GET /api/feedback/stats/summary',
      createFeedback: 'POST /api/feedback',
      getFeedbackById: 'GET /api/feedback/:id',
      updateFeedback: 'PUT /api/feedback/:id',
      deleteFeedback: 'DELETE /api/feedback/:id'
    }
  });
});

// Mount Feedback Routes
app.use('/api/feedback', feedbackRoutes);

// Fallback to index.html for non-API client routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal Server Error', 
    message: err.message 
  });
});

module.exports = app;
