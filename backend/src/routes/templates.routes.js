const express = require('express');
const router = express.Router();
const templatesController = require('../controllers/templates.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// GET /api/templates - Get all message templates (user's + defaults)
router.get('/', templatesController.getMessageTemplates);

module.exports = router;

