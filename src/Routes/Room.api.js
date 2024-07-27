const express = require('express');
const { createRoomController, getRoomKeyController, findRoomController } = require('../Controllers/Room.Controller');
const router = express.Router();

router.get('/room/getRoomKey', async(req,res)=>getRoomKeyController(req,res));
router.post('/room/findRoom', async(req, res)=>findRoomController(req, res));
router.post('/room/createRoom', async (req, res) => createRoomController(req, res));
module.exports = router;
