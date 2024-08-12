const express = require("express");
const {
  getUserController,
  addUserController,
  deleteUserController,
  getUserByIdController,
  updatePasswordController,
  checkPasswordController,
  findUserByNameOrEmailController,
  updateDisplayNameController,
} = require("../Controllers/User.Controller");
const uploadCloud = require('../Middlewares/cloudinary')
const router = express.Router();

router.get("/users/:user_id", async (req, res) => getUserByIdController(req, res));
router.get("/users", async (req, res) => getUserController(req, res));
router.post("/users", async (req, res) => addUserController(req, res));
//router.put("/users/:user_id", async (req, res) =>updateUserController(req, res));
router.post("/users/password/:user_id", async (req, res) =>checkPasswordController(req, res));
router.put("/users/password/:user_id", async (req, res) =>updatePasswordController(req, res));
router.delete("/users/:user_id", async (req, res) =>deleteUserController(req, res));
router.post("/users/premium", async(req,res) => updatePremiumController(req,res));
router.post("/users/findByNameOrEmail/:user_id", async(req, res)=>findUserByNameOrEmailController(req, res));
router.put("/users/displayname", uploadCloud.single('avatar'),async(req, res)=>updateDisplayNameController(req, res));

module.exports = router;
