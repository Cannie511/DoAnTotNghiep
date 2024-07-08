const express = require('express');
const { createRoomController, createScheduleController } = require('../Controllers/Room.Controller');
const router = express.Router();

router.post('/room/:user_id', async (req, res) => createRoomController(req, res));
router.post('/room/schedule/:user_id', async (req, res) => createScheduleController(req, res));

module.exports = router;
