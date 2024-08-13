const express = require("express");
const {findFriendController,addFriendController,deleteFriendController,getAllFriendController,getFriendNotInRoomController, getSuggestAddFriendController} = require("../Controllers/Friend.Controller");
const router = express.Router();

router.get("/friend/suggest/:user_id",async(req,res) => getSuggestAddFriendController(req,res))
router.get("/friend/:user_id/:status",async(req,res)=> getAllFriendController(req,res))
router.get("/friend/getNotInRoom/:user_id/:room_id",async(req,res)=> getFriendNotInRoomController(req,res))
router.post("/findFriend",async(req,res) => findFriendController(req,res));
router.post("/friend",async(req,res)=> addFriendController(req,res))
router.delete("/friend/:user_id/:friend_id/:status" ,async(req,res)=> deleteFriendController(req,res))


module.exports = router;