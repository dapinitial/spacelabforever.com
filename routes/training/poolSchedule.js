const express = require('express');
const poolScheduleController = require('../../controllers/poolScheduleController');
const router = express.Router();

// Define your routes
router.get('/poolSchedule', poolScheduleController.getPoolSchedule);
router.get('/poolSchedule/:date', poolScheduleController.getPoolScheduleByDate);

module.exports = router;
