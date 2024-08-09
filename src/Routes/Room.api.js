const express = require('express');
const { createRoomController, getRoomKeyController, findRoomController, checkRoomPasswordController, getAllRoom, deleteRoomController } = require('../Controllers/Room.Controller');
const router = express.Router();

router.get('/room/getRoomKey', async(req,res)=>getRoomKeyController(req,res));
router.get('/room/getAll/:user_id', async(req, res)=>getAllRoom(req, res));
router.post('/room/findRoom', async(req, res)=>findRoomController(req, res));
router.post('/room/createRoom', async (req, res) => createRoomController(req, res));
router.post('/room/checkRoomPassword', async(req,res)=>checkRoomPasswordController(req,res));
router.delete('/room/delete/:room_id', async(req, res)=>deleteRoomController(req, res));
module.exports = router;
