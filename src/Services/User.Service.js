const Model = require("../models");
const { checkPassword, hashPassword } = require("../Utils/HashPassword");
const { handleError, handleResult } = require("../Utils/Http");

const getUsersByIdService = async (user_id) => {
  try {
    if (!user_id)
      return res.status(422).json({ message: "User_id is required" });
    const user = await Model.User.findOne({
      attributes: [
        "id",
        "email",
        "display_name",
        "language",
        "premium",
        "linked_account",
        "createdAt",
      ],
      where: {
        id: user_id,
      },
      raw:true
    });
    if (user) {
      return handleResult(200, "get user successfully", user);
    }
    return handleResult(400, "User not found");
  } catch (error) {
    return err = handleError(error);
  }
};

const getUsersService = async () => {
  try {
    const users = await Model.User.findAll({
      attributes: [
        "id",
        "email",
        "display_name",
        "language",
        "premium",
        "linked_account",
        "createdAt",
      ],
      raw: true,
    });
    if (!users)
      return handleResult(400, "get user failed");
    return handleResult(200, "get user successfully", data);
  } catch (error) {
    return handleError(error);
  }
};

const addUsersService = async (
  email,
  password,
  display_name,
  language,
  premium,
  linked_account
) => {
  try {
    const isExists = await Model.User.findOne({
      where: {
        email: email,

      },
      raw: true,
    });
    if (isExists)
      return handleResult(405, "User is already exist! Try another email");
    const users = await Model.User.create({
      email,
      password,
      display_name,
      language,
      premium,
      linked_account,
    });
    if (!users)
      return handleResult(400, "add user failed");
    return handleResult(200, "add user successfully", {
      data: {
        email,
        display_name,
        language,
        premium
      },
    });
  } catch (error) {
    return handleError(error);
  }
};

const updateUserService = async (
  user_id,
  email,
  display_name,
  language,
  premium,
  linked_account
) => {
  try {
    if (!user_id)
      return handleResult(422, "User_id is required");
    const isExists = await Model.User.findOne({
      where: {
        id: user_id,
      },
      raw: true,
    });
    if (isExists) {
      const data = await Model.User.update(
        {
          email: email,
          display_name: display_name,
          language: language,
          premium: premium,
          linked_account: linked_account,
        },
        {
          where: {
            id: user_id,
          },
          raw: true,
        }
      );
      if (+data === 1)
        return handleResult(200, "Update user successfully");
      return handleResult(405, "Update user failed");
    }
    return handleResult(422, "User is not exist");
  } catch (error) {
    return handleError(error);
  }
};

const updatePasswordService = async (user_id, old_password, new_password)=>{
  try {
    const isExist = await Model.User.findOne({
      attributes: ["id", "password"],
      where: {
        id: user_id,
      },
      raw: true,
    });
    if (isExist) {
       if (checkPassword(old_password, isExist.password)) {
        const data = await Model.User.update(
          {
            password: hashPassword(new_password),
          },
          {
            where: {
              id: user_id,
            },
            raw: true,
          }
        );
        if (+data === 1)
          return handleResult(200, "Update user password successfully");
        return handleResult(405, "Update user password failed");
      }
      return handleResult(422, "Old password is not correct");
    }
    return handleResult(422, "User is not exist");
  } catch (error) {
    return handleError(error)
  }
}

const deleteUserService = async (user_id) => {
  try {
    const isExists = await Model.User.findOne({
      where: {
        id: user_id,
      },
      raw: true,
    });
    if (isExists) {
      const data = await Model.User.destroy({
        where: {
          id: isExists.id,
        },
      });
      if (data !== 1) {
        return handleResult(400, "Delete user failed");
      }
      return handleResult(200, "Delete user successfully");
    }
    return handleResult(422, "User_id is not exist");
  } catch (error) {
    return handleError(error)
  }
};
module.exports = {
  getUsersByIdService,
  getUsersService,
  addUsersService,
  updateUserService,
  updatePasswordService,
  deleteUserService,
};
