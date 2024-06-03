// const express = require('express')
// const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

const { getUsersService, addUsersService } = require("../Services/User.Service");
const { hashPassword } = require("../Utils/HashPassword");
const { handleError } = require("../Utils/HttpError");
const timestamp = Date.now();
const currentDate = new Date(timestamp);
const getUserController = async (req, res) => {
  try {
    const data = await getUsersService();
    if (data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};
const addUserController = async (req, res) => {
  const { email, password, display_name, language, premium, linked_account } =
    req.body;
  console.log(email, password, display_name, language, premium, linked_account);
  const hashPass = hashPassword(password);
  try {
    const data = await addUsersService(
      email,
      hashPass, 
      display_name,
      language,
      premium,
      linked_account,
    );
    if (data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};
module.exports = { getUserController, addUserController };
