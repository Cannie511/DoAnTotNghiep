const NotificationService = require("../Services/Notification.Service");
const { handleError } = require("../Utils/Http");

class NotificationController {
    constructor(req, res){
        this.req = req;
        this.res = res;
    }

    create = async()=>{
        try {
            const {user_id, message, send_by, type, status} = this.req.body;
            if(!user_id || !message || !send_by || !type) 
                return this.res.status(422).json({message:"Các trường đều bắt buộc!"});
            const service = new NotificationService(user_id, message, send_by, type, status);
            const response = await service.create();
            if(response) return this.res.status(response.status).json(response.data);
        } catch (error) {
            const err = handleError(error);
            return this.res.status(err.status).json({ message: err.message });
        }
    }

    update = async()=>{
        try {
            const {noti_id} = this.req.body;
            if(!noti_id) 
                return this.res.status(422).json({message:"Các trường đều bắt buộc!"});
            const service = new NotificationService();
            const response = await service.update(noti_id);
            if(response) return this.res.status(response.status).json(response.data);
        } catch (error) {
            const err = handleError(error);
            return this.res.status(err.status).json({ message: err.message });
        }
    }

    getAll = async() => {
        try {
            const { user_id, type } = this.req.body;
            if(!user_id) 
                return this.res.status(422).json({message:"Các trường đều bắt buộc!"});
            const service = new NotificationService(user_id, "", 0, type, 0);
            const response = await service.getAll();
            if(response) return this.res.status(response.status).json(response.data);
        } catch (error) {
            const err = handleError(error);
            return this.res.status(err.status).json({ message: err.message });
        }
    }

    getRequest = async() => {
        try {
            const { send_by, type } = this.req.body;
            //console.log("get req:",send_by, type);
            if(!send_by) 
                return this.res.status(422).json({message:"Các trường đều bắt buộc!"});
            const service = new NotificationService(0, "", send_by, type, 0);
            const response = await service.getRequest();
            if(response) return this.res.status(response.status).json(response.data);
        } catch (error) {
            const err = handleError(error);
            return this.res.status(err.status).json({ message: err.message });
        }
    }

    countAll = async() =>{
        try {
            const { user_id, type } = this.req.body;
            if(!user_id || !type) 
                return this.res.status(422).json({message:"Các trường đều bắt buộc!"});
            const service = new NotificationService(user_id, "", 0, type, 0);
            const response = await service.countAll();
            if(response) return this.res.status(response.status).json(response.data);
        } catch (error) {
            const err = handleError(error);
            return this.res.status(err.status).json({ message: err.message });
        }
    }
}
module.exports = NotificationController;