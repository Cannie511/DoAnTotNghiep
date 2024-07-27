const RoomMessage = require("../Services/Room_Message.Service");
const { handleError } = require("../Utils/Http");

class RoomMessageController{
    constructor(req, res){
        this.req = req;
        this.res = res;
    }

    create = async()=>{
        try {
            const {room_id, user_id, message} = this.req.body;
            const room_message_service = new RoomMessage(room_id, user_id, message);
            const room_message = await room_message_service.create();
            if(room_message) return this.res.status(room_message.status).json(room_message.data);
        } catch (error) {
            return handleError(error);
        }  
    }

    findAll = async()=>{
        try {
            const {room_id} = this.req.params;
            const room_message_service = new RoomMessage(room_id, "", "");
            const room_message = await room_message_service.findAll();
            if(room_message) return this.res.status(room_message.status).json(room_message.data);
        } catch (error) {
            return handleError(error);
        }
    }
}

module.exports = RoomMessageController;