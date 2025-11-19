const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts.controller');
const authenticateUser = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateUser);

// GET /api/contacts - List all contacts
router.get('/', contactsController.getContacts);

// POST /api/contacts - Create new contact
router.post('/', contactsController.createContact);

// GET /api/contacts/:id - Get single contact
router.get('/:id', contactsController.getContactById);

// PUT /api/contacts/:id - Update contact
router.put('/:id', contactsController.updateContact);

// DELETE /api/contacts/:id - Delete contact (soft delete)
router.delete('/:id', contactsController.deleteContact);

module.exports = router;

