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
        Password: password ? password: "",
      });
    } else {
      data = await Model.Rooms.create({
        Room_key: +roomKey,
        User_amount: 100,
        Host_id: host_ID,
        Create_by: host_ID,
        Time_start: time,
        Password: password ? password : "",
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
      const newKey = generateRoomKeyService();
      room = await Model.Rooms.findOne({
        where: {
          Room_key: newKey,
        },
        raw: true,
      });
      if(!room) roomKey = newKey;
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
    
    if(room){
      const roomTemp = {
        id: room.id,
        Room_key: room.Room_key,
        User_amount: room.User_amount,
        Host_id: room.Host_id,
        Create_by: room.Create_by,
        Password: room.Password ? true : false,
      };
      return handleResult(200, "Tìm thấy phòng", roomTemp);
    } 
    return handleResult(422, "Không tìm thấy phòng");
  } catch (error) {
    return handleError(error)
  } 
}

const checkRoomPasswordService = async(room_id, password)=>{
  try {
    const room = await Model.Rooms.findOne({
      where: {
        id: room_id,
      },
      raw: true,
    });
    if (room.Password === password) {
      return handleResult(200, "Mật khẩu trùng khớp");
    } else return handleResult(422, "Mật khẩu không trùng khớp");
  } catch (error) {
    return handleError(error)
  }
}

const deleteRoomService = async(room_id)=>{
  try {
    const findRoom = await Model.Rooms.findOne({
      where:{
        id: room_id
      }, raw: true
    })
    if(findRoom){
      const room = await Model.Rooms.destroy({
        where: {
          id: room_id,
        },
      });
      if(+room === 1) return handleResult(200, "Xóa phòng thành công");
      return handleResult(422, "Xóa phòng thất bại")
    }
    else return handleResult(422, "Không tìm thấy phòng");
  } catch (error) {
    return handleError(error)
  }
}

module.exports = {
  createRoomService,
  getRoomKeyService,
  findRoomService,
  checkRoomPasswordService,
  deleteRoomService,
};
