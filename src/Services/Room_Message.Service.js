const Model = require("../models");
const { handleResult, handleError } = require("../Utils/Http");
class RoomMessage {
    constructor(room_id, send_by, message){
        this.room_id = room_id;
        this.send_by = send_by;
        this.message = message;
    }
    create = async() =>{
        try {
            const room_message = await Model.ROOM_MESSAGE.create({
                Room_ID: this.room_id,
                Send_by: this.send_by
            },{raw:true})
            if(room_message) return handleResult(200, "Gửi tin nhắn thành công!", room_message);
            else return handleResult(422, "Gửi tin nhắn thất bại");
        } catch (error) {
            return handleError(error);
        }
    }
}
module.exports = RoomMessage;