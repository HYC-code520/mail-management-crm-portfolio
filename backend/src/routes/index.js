const express = require('express');
const router = express.Router();

const contactsRoutes = require('./contacts.routes');
// TODO: Add other routes as we migrate them
// const mailItemsRoutes = require('./mailItems.routes');
// const messagesRoutes = require('./messages.routes');
// const templatesRoutes = require('./templates.routes');

router.use('/contacts', contactsRoutes);
// router.use('/mail-items', mailItemsRoutes);
// router.use('/messages', messagesRoutes);
// router.use('/templates', templatesRoutes);

module.exports = router;

