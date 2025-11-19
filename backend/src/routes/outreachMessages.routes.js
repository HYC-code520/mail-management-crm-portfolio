const express = require('express');
const router = express.Router();
const outreachMessagesController = require('../controllers/outreachMessages.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// GET /api/outreach-messages - Get all messages (with optional filters)
router.get('/', outreachMessagesController.getOutreachMessages);

// POST /api/outreach-messages - Create a new outreach message
router.post('/', outreachMessagesController.createOutreachMessage);

module.exports = router;

