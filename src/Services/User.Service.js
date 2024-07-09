const Model = require("../models");
const { Op, where } = require("sequelize");
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
      raw: true,
    });
    if (user) {
      return handleResult(200, "get user successfully", user);
    }
    return handleResult(400, "User not found");
  } catch (error) {
    return (err = handleError(error));
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
        "avatar",
        "linked_account",
        "createdAt",
      ],
      raw: true,
    });
    if (!users) return handleResult(400, "get user failed");
    return handleResult(200, "get user successfully", users);
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
  linked_account,
  avatar
) => {
  try {
    const isExists = await Model.User.findOne({
      where: {
        email: email,
        linked_account: linked_account,
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
      avatar,
    });
    if (!users) return handleResult(400, "add user failed");
    return handleResult(200, "add user successfully", {
      data: {
        id: users.id,
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

const updateUserService = async (
  user_id,
  email,
  display_name,
  language,
  premium,
  linked_account
) => {
  try {
    if (!user_id) return handleResult(422, "User_id is required");
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
      if (+data === 1) return handleResult(200, "Update user successfully");
      return handleResult(405, "Update user failed");
    }
    return handleResult(422, "Người dùng không tồn tại");
  } catch (error) {
    return handleError(error);
  }
};

const checkPassService = async (user_id, old_password) => {
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
        return handleResult(200, "Mật khẩu trùng khớp");
      } else return handleResult(421, "Mật khẩu không đúng");
    }
    return handleResult(400, "Người dùng không tồn tại!");
  } catch (error) {
    return handleError(error);
  }
};

const updatePasswordWithoutOldPasswordService = async (email, new_password) => {
  try {
    const isExist = await Model.User.findOne({
      attributes: ["id", "email", "password"],
      where: {
        email: email,
        linked_account: "verify",
      },
      raw: true,
    });
    if (isExist) {
      const data = await Model.User.update(
        {
          password: hashPassword(new_password),
        },
        {
          where: {
            id: isExist.id,
          },
          raw: true,
        }
      );
      if (+data === 1) return handleResult(200, "Đổi mật khẩu thành công");
      return handleResult(405, "Đổi mật khẩu thất bại");
    }
    return handleResult(421, "Người dùng không tồn tại");
  } catch (error) {
    return handleError(error);
  }
};

const updatePasswordService = async (user_id, old_password, new_password) => {
  try {
    if (old_password === new_password)
      return handleResult(422, "Mật khẩu cũ không được giống với mật khẩu mới");
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
        if (+data === 1) return handleResult(200, "Đổi mật khẩu thành công");
        return handleResult(405, "Đổi mật khẩu thất bại");
      }
      return handleResult(421, "Mật khẩu cũ không đúng");
    }
    return handleResult(422, "Người dùng không tồn tại");
  } catch (error) {
    return handleError(error);
  }
};

const findUserService = async (emailValue) => {
  try {
    const listUser = await Model.User.findAll({
      attributes: [
        "id",
        "email",
        "display_name",
        "language",
        "premium",
        "linked_account",
      ],
      where: {
        email: {
          [Op.like]: `%${emailValue}%`,
        },
        linked_account: "verify",
      },
      raw: true,
    });
    return handleResult(200, "search user", listUser);
  } catch (error) {
    return handleError(error);
  }
};

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
    return handleError(error);
  }
};

//tìm bạn với name(done)
const FindUserByName = async (user_name) => {
  try {
    const user = await Model.User.findAll({
      attributes: [
        "id",
        "email",
        "display_name",
        "language",
        "premium",
        "createdAt",
      ],
      where: {
        display_name: {
          [Op.like]: `%${user_name}%`,
        },
      },
      raw: true,
    });
    if (user) {
      return handleResult(200, "get user successfully", user);
    }
    return handleResult(400, "User not found");
  } catch (error) {
    return (err = handleError(error));
  }
};

//thêm bạn(done)
const addFriend = async (user_id, friend, id) => {
  try {
    const user = await Model.USER_FRIEND.create({
      User_ID: user_id,
      Friend_ID: friend,
      id,
      status: 0,
    });
    const Friend_user = await Model.USER_FRIEND.create({
      User_ID: friend,
      id,
      Friend_ID: user_id,
      status: 0,
    });
    if (user) {
      return handleResult(200, "Add friend successfully", user);
    }
    return handleResult(400, "Add friend error");
  } catch (error) {
    return (err = handleError(error));
  }
};

// xóa bạn(done)
const deleteFriend = async (user_id, friend_id) => {
  try {
    const find = await Model.USER_FRIEND.findOne({
      where: {
        User_ID: user_id,
        Friend_ID: friend_id,
      },
      raw: true,
    });

    if (find) {
      const data = await Model.USER_FRIEND.destroy({
        where: {
          User_ID: user_id,
          Friend_ID: friend_id,
        },
      });
      const dataFriend = await Model.USER_FRIEND.destroy({
        where: {
          User_ID: friend_id,
          Friend_ID: user_id,
        },
      });
      if (data === 1) {
        return handleResult(200, "Delete friend successfully");
      } else {
        return handleResult(400, "Delete friend error");
      }
    } else {
      return handleResult(404, "Friend not found");
    }
  } catch (error) {
    return handleError(error);
  }
};

//lấy danh sách bạn bè(done)
const getAllFriend = async (user_id) => {
  try {
    const friends = await Model.USER_FRIEND.findAll({
      attributes: ["Friend_ID"],
      where: {
        User_ID: user_id,
        status: 1,
      },
      raw: true,
    });

    if (friends.length === 0) {
      return handleResult(400, "No friends found");
    }
    const friendIds = friends.map((friend) => friend.Friend_ID);
    //console.log(friendIds);
    const list = await Model.User.findAll({
      attributes: ["email", "display_name"],
      where: {
        id: friendIds,
      },
    });
    return handleResult(200, "List Friends", list);
  } catch (error) {
    return (err = handleError(error));
  }
};
//chưa test
const agreeAddFriend = async (user_id, friend_ID, action) => {
  try {
    const request = await Model.USER_FRIEND.findOne({
      attributes: ["id", "User_ID", "Friend_ID", "status"],
      where: {
        User_ID: user_id,
        Friend_ID: friend_ID,
        status: 0,
      },
      raw: true,
    });

    const response = await Model.USER_FRIEND.findOne({
      attributes: ["id", "User_ID", "Friend_ID", "status"],
      where: {
        User_ID: friend_ID,
        Friend_ID: user_id,
        status: 0,
      },
      raw: true,
    });
    if (action == 1) {
      if (request && response) {
        const add1 = await Model.USER_FRIEND.update(
          { status: 1 },
          { where: { User_ID: user_id, Friend_ID: friend_ID } }
        );

        const add2 = await Model.USER_FRIEND.update(
          { status: 1 },
          { where: { User_ID: friend_ID, Friend_ID: user_id } }
        );

        if (add1 && add2) return handleResult(200, "agree add friend ");
        return handleResult(400, "agree add friend error");
      } else {
        const des1 = await Model.USER_FRIEND.destroy({
          where: {
            User_ID: friend_id,
            Friend_ID: user_id,
          },
        });

        const des2 = await Model.USER_FRIEND.destroy({
          where: {
            User_ID: user_id,
            Friend_ID: friend_id,
          },
        });
        if (des1 && des2) return handleResult(200, "disagree add friend ");
        return handleResult(400, "disagree add friend error ");
      }
    }
  } catch {
    return (err = handleError(error));
  }
};

module.exports = {
  getUsersByIdService,
  getUsersService,
  addUsersService,
  updateUserService,
  updatePasswordService,
  deleteUserService,
  checkPassService,
  findUserService,
  updatePasswordWithoutOldPasswordService,
  addFriend,
  getAllFriend,
  deleteFriend,
  FindUserByName,
  agreeAddFriend,
};
