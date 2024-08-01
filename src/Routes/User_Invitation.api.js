const express = require("express");
const UserInvitationController = require("../Controllers/User_Invitation.Controller");
const router = express.Router();

router.post("/user_invitation/create", async(req,res)=>{
    const controller = new UserInvitationController(req, res);
    return await controller.create();
})

router.get("/user_invitation/:user_id", async (req, res) => {
  const controller = new UserInvitationController(req, res);
  return await controller.findAll();
});

router.delete("/user_invitation/:user_id/:room_id/:send_by", async (req, res) => {
  const controller = new UserInvitationController(req, res);
  return await controller.delete();
});

module.exports = router;