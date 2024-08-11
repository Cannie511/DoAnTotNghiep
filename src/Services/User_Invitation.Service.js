const Model = require("../models");
const { handleResult, handleError } = require("../Utils/Http");
class UserInvitationService {
    constructor(user_id, room_id, send_by){
        this.user_id = user_id;
        this.room_id = room_id;
        this.send_by = send_by;
    }

    create = async()=>{
        try {
            const user_invitation = await Model.USER_INVITATION.create({
                User_ID: this.user_id,
                Room_ID: this.room_id,
                Send_by: this.send_by
            })
            if(user_invitation) return handleResult(200, "Tạo lời mời thành công!", user_invitation);
            else return handleResult(422, "Tạo lời mời thất bại");
        } catch (error) {
            return handleError(error)
        }
    }

    findOne = async() =>{
        try {
            const user_invitation = await Model.USER_INVITATION.findOne({
              where: {
                User_ID: this.user_id,
                Room_ID: this.room_id,
                Send_by: this.send_by
              },
              raw: true,
            });
            if(user_invitation) return handleResult(200, "Tìm thấy lời mời", user_invitation);
            else return handleResult(422, "Không tìm thấy lời mời");
        } catch (error) {
            return handleError(error);
        }
    }
    
    findAll = async() =>{
        try {
          const user_invitation = await Model.USER_INVITATION.findAll({
            include: [
              {
                model: Model.User,
                as: "receiver",
                attributes: ["display_name", "avatar"],
              },
              {
                model: Model.Rooms,
                attributes: ["Room_key", "Time_start"],
              },
              {
                model: Model.User,
                as: "sender",
                attributes: ["display_name", "avatar"],
              },
            ],
            where: {
              User_ID: this.user_id,
            },
            raw: true,
          });
          if(user_invitation.length === 0) return handleResult(200, "Chưa có lời mời tham gia cuộc họp nào", user_invitation);
          if(user_invitation) return handleResult(200, "Lấy danh sách lời mời thành công", user_invitation);
          else return handleResult(422, "Lấy danh sách lời mời thất bại");
        } catch (error) {
            return handleError(error)
        }
    }

    delete = async(id) =>{
      try {
        const user_invitation = await Model.USER_INVITATION.destroy({
          where :{
            id: id
          }, raw:true
        })
        console.log(user_invitation)
        if(+user_invitation === 1) return handleResult(200, "Xóa lời mời thành công");
        else return handleResult(422, "Xóa lời mời thất bại")
      } catch (error) {
        return handleError(error);
      } 
    }
}

module.exports = UserInvitationService;