const express = require('express');
const { createScheduleController, getScheduleController, deleteScheduleController } = require('../Controllers/Schedule.Controller');
const router = express.Router();


router.post('/schedule/getSchedule', async (req, res) => getScheduleController(req, res));
router.post('/schedule/createSchedule', async (req, res) => createScheduleController(req, res));
router.delete("/schedule/delete/:schedule_id", async (req, res) => deleteScheduleController(req, res));
module.exports = router;
