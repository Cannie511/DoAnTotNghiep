const {
  getUsersByIdService,
  addUsersService,
  deleteUserService,
  updateUserService,
} = require("../Services/User.Service");
const { hashPassword } = require("../Utils/HashPassword");
const { handleError } = require("../Utils/Http");
const pagination = require("../Utils/Pagination");

const getUserByIdController = async (req, res) => {
  try {
    const { user_id } = req.params;
    const data = await getUsersByIdService(user_id);
    console.log(data);
    return res.status(data.status).json(data);
  } catch (error) {
    return err = handleError(error)
  }
};

const getUserController = async (req, res) => {
  try {
    const { page } = req.query;
    if (page) {
      const attr = [
        "id",
        "email",
        "display_name",
        "language",
        "premium",
        "linked_account",
        "createdAt",
      ];
      const data = await pagination("User", attr, page);
      if (data) return res.status(data.status).json(data);
    }
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
  const hashPass = hashPassword(password);
  try {
    const data = await addUsersService(
      email,
      hashPass,
      display_name,
      language,
      premium,
      linked_account
    );
    if (data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { email, display_name, language, premium, linked_account } = req.body;
    const data = await updateUserService(
      user_id,
      email,
      display_name,
      language,
      premium,
      linked_account
    );
    if (data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};

const deleteUserController = async (req, res) => {
  const { user_id } = req.params;
  try {
    const data = await deleteUserService(user_id);
    if (data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};

module.exports = {
  getUserByIdController,
  getUserController,
  addUserController,
  updateUserController,
  deleteUserController,
};
