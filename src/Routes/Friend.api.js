const express = require("express");
const {findFriendController,addFriendController,deleteFriendController,getAllFriendController, getFriendNotInRoomController} = require("../Controllers/Friend.Controller");
const router = express.Router();

    //friends
router.get("/friend/:user_id/:status",async(req,res)=> getAllFriendController(req,res))
router.get("/friend/getNotInRoom/:user_id/:room_id",async(req,res)=> getFriendNotInRoomController(req,res))
router.post("/findFriend",async(req,res) => findFriendController(req,res));
router.post("/friend",async(req,res)=> addFriendController(req,res))
router.delete("/friend/:user_id/:friend_id" ,async(req,res)=> deleteFriendController(req,res))


module.exports = router;