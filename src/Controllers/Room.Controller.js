

const { createRoomService, getRoomKeyService, findRoomService } = require("../Services/Room.Service");
const { handleError } = require("../Utils/Http");

const createRoomController = async(req,res) =>{
    try
    {
        const { user_id } = req.params;
        if(!user_id) return res.status(422).json({message:"Không nhận được user_id"});
        const data = await createRoomService(user_id);
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

module.exports = {
  createRoomController,
  getRoomKeyController,
  findRoomController,
};