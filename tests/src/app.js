const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const feedbackRoutes = require('./routes/feedbackRoutes');
const feedbackController = require('./controllers/feedbackController');

const app = express();

// Security Middlewares (with relaxed CSP for Google Fonts & FontAwesome CDNs)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Performance Compression (GZIP)
app.use(compression());

// HTTP Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global Middlewares
app.use(cors());
app.use(express.json());

// Serve Static Frontend Assets
app.use(express.static(path.join(__dirname, '../public')));

// API Health / Telemetry Endpoint
app.get('/api/health', feedbackController.getHealth);

// API Info Endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Voxora Quantum Feedback & Intelligence Platform',
    version: '3.0.0',
    endpoints: {
      getAllFeedback: 'GET /api/feedback',
      getFeedbackStats: 'GET /api/feedback/stats/summary',
      createFeedback: 'POST /api/feedback',
      getFeedbackById: 'GET /api/feedback/:id',
      updateFeedback: 'PUT /api/feedback/:id',
      deleteFeedback: 'DELETE /api/feedback/:id',
      likeFeedback: 'POST /api/feedback/:id/like',
      replyFeedback: 'POST /api/feedback/:id/reply',
      exportCsv: 'GET /api/feedback/export/csv',
      exportJson: 'GET /api/feedback/export/json',
      health: 'GET /api/health'
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
