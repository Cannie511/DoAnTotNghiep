const { Op } = require("sequelize");
const { handleResult, handleError } = require("../Utils/Http");
const Model = require("../models");
const moment = require("moment-timezone");

const saveMessageService = async (message, send_by, received_by) => {
  try {
    const messages = await Model.MESSAGE.create(
      {
        Message: message,
        Send_by: send_by,
        Received_by: received_by,
        raw: true,
      },
    );
    if(messages){
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

module.exports = { saveMessageService, getMessageService };
