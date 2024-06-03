const express = require("express");
const { getUserController, addUserController } = require("../Controllers/User.Controller");
const router = express.Router();


router.get('/users', async (req, res)=> getUserController(req, res));
router.post('/users', async (req, res)=> addUserController(req, res));

module.exports = router;
