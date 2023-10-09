const express = require('express');
const groupFitnessController = require('../../controllers/groupFitnessController');
const router = express.Router();

// Define your routes
router.get('/groupFitness', groupFitnessController.getGroupFitnessSchedule);
router.get('/groupFitness/:date', groupFitnessController.getGroupFitnessScheduleByDate);

module.exports = router;
