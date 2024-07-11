const express = require('express');
const { createScheduleController, getScheduleController } = require('../Controllers/Schedule.Controller');
const router = express.Router();


router.post('/schedule/getSchedule', async (req, res) => getScheduleController(req, res));
router.post('/schedule/createSchedule', async (req, res) => createScheduleController(req, res));

module.exports = router;
