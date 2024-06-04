const express = require("express");
const { getUserController, addUserController, deleteUserController, updateUserController, getUserByIdController } = require("../Controllers/User.Controller");
const router = express.Router();

router.get("/users/:user_id", async (req, res) => getUserByIdController(req, res));
router.get('/users', async (req, res) => getUserController(req, res));
router.post('/users', async (req, res) => addUserController(req, res));
router.put("/users/:user_id", async (req, res) => updateUserController(req, res));
router.delete("/users/:user_id", async (req, res) => deleteUserController(req, res));

module.exports = router;
