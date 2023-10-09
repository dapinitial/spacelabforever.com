const express = require('express');
const sensorsController = require('../../controllers/sensorsController');
const router = express.Router();

// Define your routes
router.get('/getFirstSensorData', sensorsController.getFirstSensorData);
router.get('/getLatestSensorData', sensorsController.getLatestSensorData);
router.get('/getAllSensorData', sensorsController.getAllSensorData);

module.exports = router;