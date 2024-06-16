const express = require("express");
const { loginController, registerController, checkEmailController, checkSessionController, GoogleLoginController } = require("../Controllers/Auth.Controller");
const router = express.Router();

router.post("/login", async (req, res) => loginController(req, res));
router.post('/register', async(req, res)=>registerController(req,res));
router.post('/checkEmail', async(req, res)=>checkEmailController(req, res));
router.post('/checkSession', async(req,res)=>checkSessionController(req,res));
router.post('/loginWithGoogle', async(req, res)=>GoogleLoginController(req, res));

module.exports = router