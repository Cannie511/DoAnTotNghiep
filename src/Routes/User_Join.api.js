const express = require("express");
const router = express.Router();
const UserJoinController = require("../Controllers/User_Join.Controller")

router.get("/user_join/:user_id/:room_id", async (req, res) => {
  const userJoin = new UserJoinController(req, res);
  return await userJoin.findAll();
});

router.post("/user_join/join", async (req, res) => {
  const userJoin = new UserJoinController(req, res);
  return await userJoin.create();
});

router.delete("/user_join/left/:user_id/:room_id", async (req, res) => {
  const userJoin = new UserJoinController(req, res);
  return await userJoin.delete();
});

module.exports = router;
