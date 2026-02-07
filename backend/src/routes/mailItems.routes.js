const express = require('express');
const router = express.Router();
const mailItemsController = require('../controllers/mailItems.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// GET /api/mail-items - Get all mail items (with optional contact_id filter)
router.get('/', mailItemsController.getMailItems);

// POST /api/mail-items - Create a new mail item
router.post('/', mailItemsController.createMailItem);

// PUT /api/mail-items/:id - Update mail item
router.put('/:id', mailItemsController.updateMailItemStatus);

// DELETE /api/mail-items/:id - Delete mail item
router.delete('/:id', mailItemsController.deleteMailItem);

// ============================================
// Follow-up Dismissal Routes
// ============================================

// POST /api/mail-items/dismiss-contact - Dismiss all items for a contact from follow-up
router.post('/dismiss-contact', mailItemsController.dismissContactFromFollowUp);

// POST /api/mail-items/restore-contact - Restore a dismissed contact to follow-up
router.post('/restore-contact', mailItemsController.restoreContactToFollowUp);

// GET /api/mail-items/dismissed-contacts - Get all dismissed contacts
router.get('/dismissed-contacts', mailItemsController.getDismissedContacts);

// POST /api/mail-items/dismiss-item/:id - Dismiss a single item from follow-up
router.post('/dismiss-item/:id', mailItemsController.dismissItemFromFollowUp);

// POST /api/mail-items/restore-item/:id - Restore a dismissed item to follow-up
router.post('/restore-item/:id', mailItemsController.restoreItemToFollowUp);

// POST /api/mail-items/resolve-contact/:id - Resolve all pending items for a contact
router.post('/resolve-contact/:id', mailItemsController.resolveAllItemsForContact);

module.exports = router;

