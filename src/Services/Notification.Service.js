const Model = require('../models');
const { handleError, handleResult } = require('../Utils/Http');
class NotificationService {
  constructor(user_id, message, send_by, type, status) {
    this.user_id = user_id;
    this.message = message;
    this.send_by = send_by;
    this.type = type;
    this.status = status;
  }
  create = async () => {
    try {
      const data = await Model.Notification.create(
        {
          user_id: this.user_id,
          message: this.message,
          send_by: this.send_by,
          type: this.type,
          status: this.status,
        },
        { raw: true }
      );
      if (data) return handleResult(200, "Tạo thông báo thành công", data);
      else return handleResult(422, "Tạo thông báo thất bại");
    } catch (error) {
      return handleError(error);
    }
  };
  update = async (noti_id) => {
    try {
      const data = await Model.Notification.update(
        {
          status: 1,
        },
        {
          where: {
            id: noti_id,
          },
          raw: true,
        }
      );
      if (data) return handleResult(200, "Cập nhật báo thành công", data);
      else return handleResult(422, "Cập nhật thông báo thất bại");
    } catch (error) {
      return handleError(error);
    }
  };
  getAll = async()=>{
    try {
      const data = await Model.Notification.findAll({
        include: [
          {
            model: Model.User,
            as: "Sender",
            attributes: ["display_name", "avatar"],
          }
        ],
        where: {
          user_id: this.user_id,
          type: this.type,
        },
        order: [["createdAt", "DESC"]],
        raw: true,
      });
       if (data) return handleResult(200, "Lấy báo thành công", data);
       else return handleResult(422, "Lấy thông báo thất bại");
    } catch (error) {
      return handleError(error);
    }
  }
  countAll = async()=>{
    try {
      const data = await Model.Notification.count({
        where: {
          user_id: this.user_id,
          type: this.type,
          status: 0,
        },
        order: [["createdAt", "DESC"]],
        raw: true,
      });
      if (data) return handleResult(200, "Lấy báo thành công", data);
      else return handleResult(200, "Lấy thông báo thất bại", 0);
    } catch (error) {
      return handleError(error);
    }
  }
}
module.exports = NotificationService;