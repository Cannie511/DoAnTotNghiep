const { handleResult, handleError } = require("../Utils/Http");
const Model = require('../models');
const addUsersGoogleService = async (
  email,
  password,
  display_name,
  language,
  premium,
  linked_account,
  avatar
) => {
  try {
    const isExists = await Model.User.findOne({
      where: {
        email: email,
        linked_account:'google'
      },
      raw: true
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
      avatar,
    });
    if (!users) return handleResult(400, "add user failed");
    return handleResult(200, "add user successfully", {
      data: {
        id: users?.id,
        email,
        display_name,
        language,
        premium,
        linked_account,
        avatar,
      },
    });
  } catch (error) {
    return handleError(error);
  }
};
module.exports = { addUsersGoogleService };