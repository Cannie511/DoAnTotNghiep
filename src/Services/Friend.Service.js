const Model = require("../models");
const { Op, where } = require("sequelize");

const { handleError, handleResult } = require("../Utils/Http");
//tìm bạn với name(done)
const findUserByName = async (user_name) => {
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
const addFriend = async (user_id, friend) => {
  try {
    const userExists = await Model.User.findOne({ where: { id: user_id } });
    const friendExists = await Model.User.findOne({ where: { id: friend } });

    if (!userExists || !friendExists) {
      return handleResult(400, "User or friend does not exist");
    }
    const user = await Model.USER_FRIEND.bulkCreate(
      [
        {
          User_ID: user_id,
          Friend_ID: friend,
          status: 0,
        },
        {
          User_ID: friend,
          Friend_ID: user_id,
          status: 0,
        },
      ],
      { individualHooks: true }
    );

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
          [Op.or]: [
            { User_ID: user_id, Friend_ID: friend_id },
            { User_ID: friend_id, Friend_ID: user_id },
          ],
        },
      });
      if (data !== 1) {
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

//lấy danh sách bạn bè
const getAllFriend = async (user_id) => {
  try {
    const friends = await Model.USER_FRIEND.findAll({
      attributes: [],
      where: {
        User_ID: user_id,
        status: 1,
      },
      include: [
        {
          model: Model.User,
          as: "Friend",
          attributes: ["email", "display_name", "avatar", "id"],
        },
      ],
      raw: true,
    });

    if (friends.length === 0) {
      return handleResult(400, "No friends found");
    }

    return handleResult(200, "List Friends", friends);
  } catch (error) {
    return (err = handleError(error));
  }
};

const agreeAddFriend = async (user_id, friend_ID, action) => {
  try {
    const request = await Model.USER_FRIEND.findAll({
      attributes: ["User_ID", "Friend_ID", "status"],
      where: {
        [Op.or]: [
          {
            User_ID: user_id,
            Friend_ID: friend_ID,
            status: 0,
          },
          {
            User_ID: friend_ID,
            Friend_ID: user_id,
            status: 0,
          },
        ],
      },
      raw: true,
    });
    if (action == 1) {
      if (request) {
        const add = await Model.USER_FRIEND.update(
          { status: 1 },
          {
            where: {
              [Op.or]: [
                { User_ID: user_id, Friend_ID: friend_ID },
                { User_ID: friend_ID, Friend_ID: user_id },
              ],
            },
          }
        );
        if (add) return handleResult(200, "agree add friend ");
        return handleResult(400, "agree add friend error");
      }
    } else {
      const des = await Model.USER_FRIEND.destroy({
        where: {
          [Op.or]: [
            { User_ID: user_id, Friend_ID: friend_ID },
            { User_ID: friend_ID, Friend_ID: user_id },
          ],
        },
      });
      if (des) return handleResult(200, "disagree add friend ");
      return handleResult(400, "disagree add friend error ");
    }
  } catch {
    return (err = handleError(error));
  }
};

module.exports = {
  findUserByName,
  addFriend,
  deleteFriend,
  getAllFriend,
  agreeAddFriend,
};
