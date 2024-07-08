const { Op, col, literal, fn } = require("sequelize");
const { handleResult, handleError } = require("../Utils/Http");
const Model = require("../models");
const moment = require("moment-timezone");
const pagination = require("../Utils/Pagination");

const saveMessageService = async (message, send_by, received_by) => {
  try {
    const messages = await Model.MESSAGE.create({
      Message: message,
      Send_by: send_by,
      Received_by: received_by,
      raw: true,
    });
    if (messages) {
      console.log(messages);
      return handleResult(200, "gửi tin nhắn thành công");
    }
    return handleResult(422, "gửi tin nhắn thất bại");
  } catch (error) {
    return handleError(error);
  }
};

const getMessageService = async (user1, user2) => {
  try {
    const listMessage = await Model.MESSAGE.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ Send_by: user1 }, { Received_by: user2 }],
          },
          {
            [Op.and]: [{ Send_by: user2 }, { Received_by: user1 }],
          },
        ],
      },
      order: [["createdAt", "ASC"]],
      raw: true,
    });
    const convertedMessages = listMessage.map((message) => {
      return {
        ...message,
        createdAt: moment
          .utc(message.createdAt)
          .tz("Asia/Ho_Chi_Minh")
          .format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    if (convertedMessages)
      return handleResult(200, "danh sách tin nhắn", convertedMessages);
    else return handleResult(400, "lấy tin nhắn thất bại");
  } catch (error) {
    return handleError(error);
  }
};

const getLatestMessageService = async (userId) => {
  try {
    const subQuery = await Model.MESSAGE.findAll({
      attributes: [[fn("MAX", col("createdAt")), "maxCreatedAt"]],
      where: {
        [Op.or]: [{ Send_by: userId }, { Received_by: userId }],
      },
      group: [
        fn("LEAST", col("Send_by"), col("Received_by")),
        fn("GREATEST", col("Send_by"), col("Received_by")),
      ],
      raw: true,
    });
    const latestMessageIds = subQuery.map((row) => row.maxCreatedAt);
    const message = await Model.MESSAGE.findAll({
      include: [
        {
          model: Model.User,
          as: "Sender",
          attributes: ["display_name", "avatar"],
        },
        {
          model: Model.User,
          as: "Receiver",
          attributes: ["display_name", "avatar"],
        },
      ],
      where: {
        [Op.or]: [{ Send_by: userId }, { Received_by: userId }],
        createdAt: {
          [Op.in]: latestMessageIds,
        },
      },
      attributes: [
        "id",
        "Send_by",
        "Message",
        "Received_by",
        [col("Sender.display_name"), "sender_display_name"],
        [col("Sender.avatar"), "sender_avt"],
        [col("Receiver.display_name"), "receiver_display_name"],
        [col("Receiver.avatar"), "receiver_avt"], // Đổi tên cột Receiver.avatar thành receiver_avt
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    if (latestMessageIds) {
      const convertedMessages = message.map((message) => {
        return {
          ...message,
          createdAt: moment
            .utc(message.createdAt)
            .tz("Asia/Ho_Chi_Minh")
            .format("YYYY-MM-DD HH:mm:ss"),
        };
      });
      if (convertedMessages)
        return handleResult(200, "danh sách tin nhắn", convertedMessages);
    } else return handleResult(200, "chưa có tin nhắn", null);
  } catch (error) {
    return handleError(error);
  }
};

module.exports = {
  saveMessageService,
  getMessageService,
  getLatestMessageService,
};
