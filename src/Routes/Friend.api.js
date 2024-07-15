const express = require("express");
const {findFriendController,addFriendController,deleteFriendController,getAllFriendController} = require("../Controllers/Friend.Controller");
const router = express.Router();

    //friends
router.get("/friend/:user_id/:status",async(req,res)=> getAllFriendController(req,res))
router.post("/findFriend",async(req,res) => findFriendController(req,res));
router.post("/friend",async(req,res)=> addFriendController(req,res))
router.delete("/friend",async(req,res)=> deleteFriendController(req,res))


module.exports = router;