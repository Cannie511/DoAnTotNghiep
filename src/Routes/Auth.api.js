const express = require("express");
const { AuthController } = require("../Controllers/Auth.Controller");
const router = express.Router();

router.post('/login', async(req,res)=>AuthController(req, res))

module.exports = router