const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authMiddleware = require('../middleware/auth.middleware');
const translationController = require('../controllers/translation.controller');

// Rate limiter for translation endpoint
// Limit: 100 requests per minute per user to prevent API abuse
const translateRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute (more generous)
  message: {
    success: false,
    error: 'Too many translation requests. Please try again in a moment.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Use user ID as key for rate limiting (requires auth middleware first)
  keyGenerator: (req) => {
    // Use user ID if available, otherwise use IP
    return req.user?.id || req.ip;
  },
  // Don't skip anyone - rate limit applies to all users
});

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

// POST /api/translate - Translate English text to Chinese
router.post('/', translateRateLimiter, translationController.translateText);

// GET /api/translate/status - Check if translation service is available
router.get('/status', translationController.getTranslationStatus);

module.exports = router;

