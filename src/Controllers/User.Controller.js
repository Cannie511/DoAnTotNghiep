const { getUsersService, addUsersService } = require("../Services/User.Service");
const { hashPassword } = require("../Utils/HashPassword");
const { handleError } = require("../Utils/HttpError");
const pagination = require("../Utils/Pagination");

const getUserController = async (req, res) => {
  try {
    const {page} = req.query;
    if(page){
      const attr = [
        "id",
        "email",
        "display_name",
        "language",
        "premium",
        "linked_account",
        "createdAt"
      ];
      const data = await pagination("User",attr, page); 
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
      linked_account,
    );
    if (data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};

const editUserController = async (req, res) => {
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

const deleteUserController = async (req, res) => {
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

module.exports = {
  getUserController,
  addUserController,
  editUserController,
  deleteUserController,
};
