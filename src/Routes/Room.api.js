const express = require('express');
const { createRoomController, getRoomKeyController, findRoomController, checkRoomPasswordController } = require('../Controllers/Room.Controller');
const router = express.Router();

router.get('/room/getRoomKey', async(req,res)=>getRoomKeyController(req,res));
router.post('/room/findRoom', async(req, res)=>findRoomController(req, res));
router.post('/room/createRoom', async (req, res) => createRoomController(req, res));
router.post('/room/checkRoomPassword', async(req,res)=>checkRoomPasswordController(req,res));
module.exports = router;
