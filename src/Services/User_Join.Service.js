const { Sequelize } = require("sequelize");
const Model = require("../models");
const { handleResult, handleError } = require("../Utils/Http");

class UserJoin {
  constructor(user_id, room_id) {
    this.user_id = user_id;
    this.room_id = room_id;
  }

  find = async () => {
    try {
        const data = await Model.USER_JOININ.findAll({
          include: [
            {
              model: Model.User,
              attributes: ["display_name", "avatar"],
            },
          ],
          where: {
            Room_ID: this.room_id,
            User_ID: {
              [Sequelize.Op.ne]: this.user_id,
            },
          },
          raw: true,
        });
        if (data) return handleResult(200, "Danh sách người tham gia", data);
        else return handleResult(200, "Chưa có người nào tham gia phòng");
    } catch (error) {
        return handleError(error);
    }
  };
  findUserInRoom = async (room_id, user_id) => {
    try {
        const data = await Model.USER_JOININ.findAll({
          include: [
            {
              model: Model.User,
              attributes: ["display_name", "avatar"],
            },
          ],
          where: {
            Room_ID: room_id,
            User_ID: {
              [Sequelize.Op.ne]: user_id,
            },
          },
          raw: true,
        });
        if (data) return handleResult(200, "Người dùng chưa tham gia phòng này", data);
        else return handleResult(422, "Người này chưa tham gia");
    } catch (error) {
        return handleError(error);
    }
  };
  findOne = async () => {
     try {
       const data = await Model.USER_JOININ.findOne({
         where: {
           User_ID: this.user_id,
           Room_ID: this.room_id,
         },
       });
       if (data) return handleResult(200, "Tìm thấy người tham gia", data);
       else return handleResult(422, "Không tìm thấy người tham gia");
     } catch (error) {
       return handleError(error);
     }
  };
  create = async () => {
    try {
      const data = await Model.USER_JOININ.create(
        {
          User_ID: this.user_id,
          Room_ID: this.room_id,
        },
        { raw: true }
      );
      if (data) return handleResult(200, "Tham gia thành công", data);
      else return handleResult(422, "Tham gia thất bại");
    } catch (error) {
      return handleError(error);
    }
  };

  delete = async () => {
    try {
        const data = await Model.USER_JOININ.destroy(
          {
            where: {
              User_ID: this.user_id,
              Room_ID: this.room_id,
            },
            raw: true,
          },
        );
        if (+data === 1) return handleResult(200, "Rời phòng họp thành công");
        else return handleResult(422, "Rời phòng họp thất bại");
    } catch (error) {
      return handleError(error);
    }
  };
}

module.exports = UserJoin;