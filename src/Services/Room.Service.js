const { hashPassword } = require("../Utils/HashPassword");
const { handleResult, handleError } = require("../Utils/Http");
const Model = require("../models");

//chưa test
const createRoomService = async (host_ID, time, password, roomKey) => {
  const minuteSet = new Date(time).getMinutes();
  const updatedTime = new Date(time);
  updatedTime.setMinutes(minuteSet + 60);
  const endTime = updatedTime;
  try {
    const user = await Model.User.findOne({
      attributes: ["premium"],
      where: {
        id: host_ID,
      },
      raw: true,
    });
    const premium = user.premium;
    let data;
    if (premium == 0) {
      data = await Model.Rooms.create({
        Room_key:+roomKey,
        User_amount: 60,
        Host_id: host_ID,
        Create_by: host_ID,
        Time_start: time,
        Time_end: endTime,
        Password: password ? hashPassword(password): "",
      });
    } else {
      data = await Model.Rooms.create({
        Room_key: +roomKey,
        User_amount: 100,
        Host_id: host_ID,
        Create_by: host_ID,
        Time_start: time,
        Password: password ? hashPassword(password) : "",
      });
    }
    if (data) return handleResult(200, "Create room successfully", data);
    return handleResult(400, "Create room error");
  } catch (error) {
    return (err = handleError(error));
  }
};

const generateRoomKeyService = ()=>{
  const roomKey = Math.floor(100000000 + Math.random() * 900000000).toString();
  return roomKey;
}

const getRoomKeyService = async ()=>{
  try {
    let roomKey;
    let room;
    do {
      roomKey = generateRoomKeyService();
      room = await Model.Rooms.findOne({
        where: {
          Room_key: roomKey,
        },
        raw: true,
      });
    } while (room);
    return handleResult(200, "Tạo key thành công", roomKey);
  } catch (error) {
    return handleError(error)
  } 
}

const findRoomService = async(room_key) =>{
  try {
    const room = await Model.Rooms.findOne({
      where: {
        Room_key: room_key,
      },
      raw: true,
    });
    if(room) return handleResult(200, "Tìm thấy phòng", room)
    return handleResult(422, "Không tìm thấy phòng");
  } catch (error) {
    return handleError(error)
  } 
}

module.exports = {
  createRoomService,
  getRoomKeyService,
  findRoomService,
};
