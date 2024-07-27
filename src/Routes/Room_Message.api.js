const express = require("express");
const RoomMessageController = require("../Controllers/Room_Message.Controller");
const router = express.Router();

router.get("/room_message/:room_id", async(req, res)=>{
    const room_message_controller = new RoomMessageController(req, res);
    return await room_message_controller.findAll();
})

module.exports = router;
