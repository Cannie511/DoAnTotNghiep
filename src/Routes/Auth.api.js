const express = require("express");
const { loginController, registerController, checkEmailController } = require("../Controllers/Auth.Controller");
const router = express.Router();

router.post("/login", async (req, res) => loginController(req, res));
router.post('/register', async(req, res)=>registerController(req,res));
router.post('/checkEmail', async(req, res)=>checkEmailController(req, res));
module.exports = router