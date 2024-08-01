const UserInvitationService = require("../Services/User_Invitation.Service");
const { handleError } = require("../Utils/Http");

class UserInvitationController{
    constructor(req, res){
        this.req = req;
        this.res = res;
    }

    create = async() => {
        try {
            const {list_user_id, room_id, send_by} = this.req.body;
            if(list_user_id.length === 0) return this.res.status(422).json({message: "Danh sách người nhận không được để trống"});
            if(list_user_id.length === 1){
                const user_invitation_service = new UserInvitationService(list_user_id[0], room_id, send_by);
                const data = await user_invitation_service.findOne();
                if(data.status === 200) return this.res.status(200).json({message: "Bạn đã mời người này rồi"});
                const service_create = await user_invitation_service.create();
                if(service_create) return this.res.status(service_create.status).json(service_create.data);
            }
            list_user_id.forEach(async(user_id) => {
                const user_invitation_service = new UserInvitationService(user_id, room_id, send_by);
                const service_create = await user_invitation_service.create();
                if(service_create) return this.res.status(service_create.status).json(service_create.data);
            });
        } catch (error) {
            const err = handleError(error);
            return this.res.status(err.status).json({ message: err.message }); 
        }
    }

    findAll = async() => {
        try {
            const {user_id} = this.req.params;
            if(!user_id) return this.res.status(422).json({message: "Các trường là bắt buộc"});
            const user_invitation_service = new UserInvitationService(user_id, 0, 0);
            const data = await user_invitation_service.findAll();
            if(data) return this.res.status(data.status).json(data.data)
        } catch (error) {
            const err = handleError(error);
            return this.res.status(err.status).json({ message: err.message }); 
        }
    }

    delete = async() => {
        try {
            const {user_id, room_id, send_by} = this.req.params;
            if (!user_id || !room_id || !send_by) return this.res.status(422).json({message: "Các trường là bắt buộc"});
            const user_invitation_service = new UserInvitationService(user_id, room_id ,send_by);
            const data = await user_invitation_service.delete();
            if(data) return this.res.status(data.status).json(data.data);
        } catch (error) {
            const err = handleError(error);
            return this.res.status(err.status).json({ message: err.message });
        }
    }
}

module.exports = UserInvitationController;