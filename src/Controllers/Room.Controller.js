

const { getMessageService, CreateRoomService, createScheduleService } = require("../Services/Room.Service");
const { handleError } = require("../Utils/Http");

const createRoomController = async(req,res) =>{
        try
        {
            const { user_id } = req.params;
            if(!user_id) return res.status(422).json({message:"Không nhận được user_id"});
            const data = await CreateRoomService(user_id)
            if (data) return res.status(data.status).json(data);
        }
        catch(error)
        {
            const err = handleError(error);
            return res.status(er.status).json({message: err.message})
        }
    }

const createScheduleController = async(req,res)=>
    {
        try
        {
            const { user_id } = req.params;
            const {time} = req.body;

            const data = await createScheduleService(user_id,time)
            if (data) return res.status(data.status).json(data);
        }
        catch(error)
        {
            const err = handleError(error);
            return res.status(er.status).json({message: err.message})
        }
    }

    module.exports = {createRoomController,createScheduleController };