const {
  getUsersByIdService,
  addUsersService,
  deleteUserService,
  updateUserService,
  updatePasswordService,
  checkPassService,
  findUserService,
  updatePasswordWithoutOldPasswordService,
  updatePremiumService
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
        "avatar",
        "createdAt",
      ];
      const data = await pagination("User", attr, page,{},[],[]);
      if (data) return res.status(data.status).json(data);
    }
    const response = await getUsersService();
    if (response) return res.status(response.status).json(response);
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

const checkPasswordController = async(req, res)=>{
  try {
    const {user_id} = req.params;
    const {old_password} = req.body;
    if(!user_id) return res.status(422).json({message:"Không nhận được user_id"});
    if(!old_password) return res.status(422).json({message:"Không nhận được password"});
    const data = await checkPassService(user_id, old_password);
    if(data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
}

const updatePasswordController = async (req, res)=>{
  try {
    const { user_id } = req.params;
    const { old_password, new_password } = req.body;
    if(!user_id) return res.status(422).json({message:"Không nhận được user_id"})
    //console.log(user_id);
    const data = await updatePasswordService(
      user_id,
      old_password,
      new_password
    );
    if(data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
}

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

const findUserEmail = async (req, res) => {
  try {
    const { searchValue } = req.body;
    if (!searchValue)
      return res.status(422).json({ message: "Từ khóa không được để trống" });
    const data = await findUserService(searchValue);
    if (data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};

const updatePasswordWithoutOldPasswordController = async (req, res)=>{
  try {
    const {email, new_password} = req.body;
    if(!email) return res.status(422).json({ message: "email không được để trống" });
    if(!new_password) return res.status(422).json({ message: "mật khẩu không được để trống" });
    const data = await updatePasswordWithoutOldPasswordService(email, new_password);
    if(data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
}



const updatePremiumController = async (req, res)=>
  {
    try {
      const {user_id} = req.body;
      const data = await updatePremiumService(user_id);
      if(data) return res.status(data.status).json(data);
    }catch (error){
      const err = handleError(error);
      return res.status(err.status).json({message: err.message})
    }
  }

module.exports = {
  getUserByIdController,
  getUserController,
  addUserController,
  updateUserController,
  updatePasswordController,
  deleteUserController,
  checkPasswordController,
  findUserEmail,
  updatePasswordWithoutOldPasswordController,
  updatePremiumController,
};
