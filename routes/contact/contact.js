const express = require('express');
const contactController = require('../../controllers/contactController');
const router = express.Router();

// Define your routes
router.post('/contact', contactController.submitContactForm);

module.exports = router;

