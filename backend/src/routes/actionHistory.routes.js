const express = require('express');
const router = express.Router();
const actionHistoryController = require('../controllers/actionHistory.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get action history for a specific mail item
router.get('/:mailItemId', actionHistoryController.getActionHistory);

// Create a new action history entry
router.post('/', actionHistoryController.createActionHistory);

// Bulk create action history entries
router.post('/bulk', actionHistoryController.createBulkActionHistory);

module.exports = router;

