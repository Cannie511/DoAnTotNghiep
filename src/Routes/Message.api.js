const express = require('express');
const { getMessageController } = require('../Controllers/Message.Controller');
const router = express.Router();

router.post('/message/getMessage', async(req, res)=>getMessageController(req, res));

module.exports = router;