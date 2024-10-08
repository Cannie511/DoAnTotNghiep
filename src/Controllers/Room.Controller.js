

const { createRoomService, getRoomKeyService, findRoomService, checkRoomPasswordService, deleteRoomService, updatePasswordRoomService } = require("../Services/Room.Service");
const { handleError } = require("../Utils/Http");
const pagination = require("../Utils/Pagination");

const createRoomController = async(req,res) =>{
    try
    {
        const { user_id, time, password, roomKey } = req.body;
        if(!user_id) return res.status(422).json({message:"Không nhận được user_id"});
        const data = await createRoomService(user_id, time, password, roomKey);
        if (data) return res.status(data.status).json(data);
    }
    catch(error)
    {
        const err = handleError(error);
        return res.status(err.status).json({message: err.message})
    }
}

const getRoomKeyController = async(req,res)=>{
    try {
        const data = await getRoomKeyService();
        if(data) return res.status(data.status).json(data.data);
    } catch (error) {
        const err = handleError(error);
        return res.status(err.status).json({ message: err.message });
    }
}

const findRoomController = async(req, res)=>{
    try {
        const {room_key} = req.body;
        if(!room_key) return res.status(422).json({message:"Không nhận được mã phòng"});
        const data = await findRoomService(room_key);
        if (data) return res.status(data.status).json(data.data);
    } catch (error) {
        const err = handleError(error);
        return res.status(err.status).json({ message: err.message });
    }
}

const checkRoomPasswordController = async(req, res)=>{
    try {
      const { room_id, password } = req.body;
      if (!password || !room_id)
        return res.status(422).json({ message: "Các trường là bắt buộc" });
      const data = await checkRoomPasswordService(room_id, password);
      if (data) return res.status(data.status).json(data.data);
    } catch (error) {
      const err = handleError(error);
      return res.status(err.status).json({ message: err.message });
    }
}

const getAllRoom = async(req, res)=>{
    try {
        let {page} = req.query;
        if(!page) page = 1;
        const {user_id} = req.params;
        const whereCondition = {
          Host_id: user_id,
        };
        const order = [["createdAt", "DESC"]];
        if(!user_id) return res.status(422).json({ message: "Các trường là bắt buộc" });
        const paginate = await pagination("Rooms", [], page, whereCondition, order, []);
        if(paginate) return res.status(paginate.status).json(paginate);
    } catch (error) {
        const err = handleError(error);
        return res.status(err.status).json({ message: err.message });
    }
}

const updatePasswordRoomController = async(req, res)=>{
    try {
        const {room_id, password} = req.body;
        if(!room_id || !password) return res.status(422).json({message:"Các trường là bắt buộc"});
        const roomController = await updatePasswordRoomService(room_id, password);
        if(roomController) return res.status(roomController.status).json(roomController.message);
    } catch (error) {
        const err = handleError(error);
        return res.status(err.status).json({ message: err.message });
    }
}

const deleteRoomController = async(req, res)=>{
    try {
        const {room_id} = req.params;
        if(!room_id) return res.status(422).json({message: "Không nhận được mã phòng"});
        const roomController = await deleteRoomService(room_id);
        if(roomController) return res.status(roomController.status).json(roomController.message);
    } catch (error) {
        const err = handleError(error);
        return res.status(err.status).json({ message: err.message });
    }
}

module.exports = {
  createRoomController,
  getRoomKeyController,
  findRoomController,
  checkRoomPasswordController,
  getAllRoom,
  deleteRoomController,
  updatePasswordRoomController,
};