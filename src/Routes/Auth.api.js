const express = require("express");
const { loginController, registerController } = require("../Controllers/Auth.Controller");
const router = express.Router();

router.post("/login", async (req, res) => loginController(req, res));
router.post('/register', async(req, res)=>registerController(req,res));

module.exports = router