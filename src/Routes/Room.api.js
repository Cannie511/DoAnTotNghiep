const express = require('express');
const { createRoomController, getRoomKeyController } = require('../Controllers/Room.Controller');
const router = express.Router();

router.post('/room/:user_id', async (req, res) => createRoomController(req, res));
router.get('/room/getRoomKey', async(req,res)=>getRoomKeyController(req,res));
module.exports = router;
