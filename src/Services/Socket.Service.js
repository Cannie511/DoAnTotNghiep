const { handleResult, handleError } = require('../Utils/Http');
const Model = require('../models');

class Socket {
  constructor(user_id, socket_id, status) {
    this.user_id = user_id;
    this.socket_id = socket_id;
    this.status = status;
  }
  connectSocket = async () => {
    const socket = await Model.Socket.findOne({
      where: { user_id: this.user_id },
      raw: true,
    });
    if (socket) return this.update();
    else return this.create();
  };
  create = async () => {
    try {
      const data = await Model.Socket.create(
        {
          user_id: this.user_id,
          socket_id: this.socket_id,
          status: this.status,
        },
        { raw: true }
      );
      if (data) return handleResult(200, "kết nối socket thành công", data);
      else return handleResult(422, "không tìm thấy kết nối");
    } catch (error) {
      return handleError(error);
    }
  };
  update = async () => {
    try {
      const data = await Model.Socket.update(
        {
          socket_id: this.socket_id,
          status: this.status,
        },
        {
          where: { user_id: this.user_id },
          raw: true,
        }
      );
      if (+data === 1) return handleResult(200, "cập nhật socket thành công");
      else return handleResult(400, "cập nhật socket thất bại");
    } catch (error) {
      return handleError(error);
    }
  };
  searchOne = async (user_id) => {
    try {
      const socket = await Model.Socket.findOne({
        where: { user_id: user_id },
        raw: true,
      });
      if (socket) return handleResult(200, "Tìm thấy socket", socket);
      else return handleResult(200, "Người dùng chưa online");
    } catch (error) {
      return handleError(error);
    }
  };

  searchSocketId = async (socket_id) => {
    try {
      const socket = await Model.Socket.findOne({
        where: { socket_id: socket_id },
        raw: true,
      });
      if (socket) return handleResult(200, "Tìm thấy socket", socket);
      else return handleResult(200, "Người dùng chưa online");
    } catch (error) {
      return handleError(error);
    }
  };
}
module.exports = Socket;

