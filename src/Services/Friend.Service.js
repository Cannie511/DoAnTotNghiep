const Model = require("../models");
const { Op } = require("sequelize");

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

const addFriend = async (user_id, friend_id) => {
  try {
    const userExists = await Model.User.findOne({ where: { id: user_id } });
    const friendExists = await Model.User.findOne({ where: { id: friend_id } });
    const user_friend = await Model.USER_FRIEND.findOne({
      where: {
        [Op.or]: [
          {
            User_ID: user_id,
            Friend_ID: friend_id,
            status: 0,
          },
          {
            User_ID: friend_id,
            Friend_ID: user_id,
            status: 0,
          },
        ],
      }, raw:true
    });
    if (user_friend){
      return handleResult(201, "Bạn đã gửi lời mời rồi!");
    }
      if (!userExists || !friendExists) {
        return handleResult(400, "User or friend does not exist");
      }
    const user = await Model.USER_FRIEND.bulkCreate(
      [
        {
          User_ID: user_id,
          Friend_ID: friend_id,
          status: 0,
        },
        {
          User_ID: friend_id,
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

const suggestAddFriend = async (user_id)=>{
  try {
    const friends = await Model.USER_FRIEND.findAll({
      attributes: ['Friend_ID'],
      where: {
        User_ID: user_id,
      },
      raw: true,
    });

    // Trích xuất danh sách Friend_ID từ kết quả
    const friendIds = friends.map(friend => friend.Friend_ID);

    // Tìm các người dùng không phải là bạn bè
    const data = await Model.User.findAll({
      attributes: ["email", "display_name", "avatar", "id"],
      where: {
        id: {
          [Op.ne]: user_id,
          [Op.notIn]: friendIds,  // Lọc ra các id không nằm trong danh sách friendIds
        }
      }, raw:true
    })
    console.log("Kết quả truy vấn:", data);
    if (data.length === 0) {
      console.log("Không tìm thấy dữ liệu phù hợp.");
      return handleResult(422, "Không có bạn bè đề xuất", []);
    }
    return handleResult(200, "suggest", data);
  } catch (error) {
    return (err = handleError(error));
  }
}

 const getFriendNotInRoom = async (user_id, room_id) => {
  try {
    const friend_not_in_room = await Model.USER_FRIEND.findAll({
      include: [
        {
          model: Model.User,
          as: "Friend",
          attributes: ["display_name", "avatar", "email"],
        },
      ],
      where: {
        User_ID: user_id,
        Friend_ID: {
          [Op.notIn]: Model.Sequelize.literal(`(
            SELECT User_ID 
            FROM user_joinins 
            WHERE Room_ID = ${room_id}
          )`),
        },
      },
      raw: true,
    });
    if(friend_not_in_room.length === 0) return handleResult(200, "Không còn bạn bè chưa tham gia" )
    else if(friend_not_in_room.length > 0) return handleResult(200, "Lấy bạn bè không có trong phòng thành công" ,friend_not_in_room )
    else return handleResult(422, "Lấy bạn bè không có trong phòng thất bại")
  } catch (error) {
    return handleError(error)
  }
};

module.exports = {
  findUserByName,
  addFriend,
  deleteFriend,
  getAllFriend,
  agreeAddFriend,
  suggestAddFriend,
  getFriendNotInRoom,
};

