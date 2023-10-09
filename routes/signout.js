const express = require('express');
const router = express.Router();
const signoutController = require('../controllers/signoutController');

router.get('/signout', signoutController.handleSignout);

module.exports = router;