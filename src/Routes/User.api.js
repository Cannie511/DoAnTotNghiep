const express = require("express");
const { getUserController, addUserController, deleteUserController, updateUserController, getUserByIdController, updatePasswordController, checkPasswordController, findFriendController, addFriendController, getAllFriendController, deleteFriendController } = require("../Controllers/User.Controller");
const { getAllFriend } = require("../Services/User.Service");
const router = express.Router();

router.get("/users/:user_id", async (req, res) => getUserByIdController(req, res));
router.get('/users', async (req, res) => getUserController(req, res));
router.post('/users', async (req, res) => addUserController(req, res));
router.put("/users/:user_id", async (req, res) => updateUserController(req, res));
router.post("/users/password/:user_id", async(req, res)=>checkPasswordController(req, res));
router.put("/users/password/:user_id",async(req, res)=>updatePasswordController(req, res));
router.delete("/users/:user_id", async (req, res) => deleteUserController(req, res));
//friends
router.get("/friend/:user_id",async(req,res)=> getAllFriendController(req,res))
router.post("/friend",async(req,res) => findFriendController(req,res));
router.post("/friend/:user_id",async(req,res)=> addFriendController(req,res))
router.delete("/friend/:user_id",async(req,res)=> deleteFriendController(req,res))
module.exports = router;
