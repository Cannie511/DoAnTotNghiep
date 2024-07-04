const express = require('express');
const { getMessageController, getLatestMessageController } = require('../Controllers/Message.Controller');
const router = express.Router();

router.post('/message/getMessage', async(req, res)=>getMessageController(req, res));
router.post('/message/getLatestMessage', async(req, res)=>getLatestMessageController(req, res));

module.exports = router;