const { Op } = require('sequelize');
const Model = require('../models');
const { handleResult, handleError } = require('../Utils/Http');
const { createRoomService } = require('./Room.Service');

const createScheduleService = async (user_id, time, password={}, roomKey) => {
  try {
    const minuteSet = new Date(time).getMinutes();
    const updatedTime = new Date(time);
    updatedTime.setMinutes(minuteSet + 60);
    const data = await createRoomService(user_id, time, password, roomKey);
    let res;
    if (data.status === 200 && data.data) {
      res = data.data;
    }
    //console.log(res);
    const room_Id = res.id;
    const Schedule = await Model.SCHEDULE.create({
      User_ID: user_id,
      Room_ID: room_Id,
      Time: time,
    });
    if (Schedule)
      return handleResult(200, "Create Schedule successfully", Schedule);
    return handleResult(400, "Create Schedule error");
  } catch (error) {
    return (err = handleError(error));
  }
};

/**
 * 
 * @param {*} user_id người tạo lịch
 * @param {*} timeDiff thời gian lấy trong khoảng (phút): 1 tiếng = 60 phút
 * @returns 
 */
const getScheduleService = async (user_id, timeDiff) =>{
  try {
    const currentTime = new Date();
    const getDiff = new Date(currentTime.getTime() + Number(timeDiff) * 60 * 1000);
    const data = await Model.SCHEDULE.findAll({
      include: [
        {
          model: Model.Rooms,
          attributes: ["Room_key", "password"],
        },
      ],
      where: {
        User_ID: user_id,
        Time: {
          [Op.between]: [currentTime, getDiff],
        },
      },
      order: [["Time", "ASC"]],
      raw: true,
    });
    console.log(data);
    if(data) return handleResult(200, "Lấy Lịch trình thành công", data);
    return handleResult(400, "Lấy lịch trình thất bại", data);
  } catch (error) {
    return handleError(error)
  }
}

const deleteScheduleService = async(id) =>{
  try {
    const data = await Model.SCHEDULE.findOne({
      where: {
        id: id,
      },
    });
    if (data) {
      const deleteSchedule = await Model.SCHEDULE.destroy({
        where: {
          id: id,
        },
      });
      if (+deleteSchedule === 1)
        return handleResult(200, "Xóa lịch thành công");
      else return handleResult(422, "Xóa lịch thất bại");
    }
    return handleResult(422, "Không tìm thấy lịch");
  } catch (error) {
    return handleError(error)
  }
}

module.exports = {
  createScheduleService,
  getScheduleService,
  deleteScheduleService,
};