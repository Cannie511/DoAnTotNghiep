const express = require("express");
const { loginController, registerController, checkEmailController, checkSessionController, GoogleLoginController, logOutController, sendEmailController, verifyEmailController } = require("../Controllers/Auth.Controller");
const { findUserEmail, updatePasswordWithoutOldPasswordController } = require("../Controllers/User.Controller");

const router = express.Router();

router.post("/login", async (req, res) => loginController(req, res));
router.post('/register', async(req, res)=>registerController(req,res));
router.post('/checkEmail', async(req, res)=>checkEmailController(req, res));
router.post('/checkSession', async(req,res)=>checkSessionController(req,res));
router.post('/loginWithGoogle', async(req, res)=>GoogleLoginController(req, res));
router.post('/logout', async(req, res)=>logOutController(req, res));
router.post("/sendCode", async (req, res) =>sendEmailController(req, res));
router.post("/verifyEmail", async (req, res) => verifyEmailController(req, res));
router.post("/findUser",  async(req,res)=>findUserEmail(req,res));
router.put('/forgotPassword', async(req, res)=>updatePasswordWithoutOldPasswordController(req, res));

module.exports = router;