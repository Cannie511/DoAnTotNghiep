const express = require("express");
const router = express.Router();
const SocketController = require('../Controllers/Socket.Controller');

router.post("/socket/getActiveStatus", async (req, res) => {
    const socket = new SocketController(req, res);
    return socket.getActiveStatus();
});

module.exports = router;
