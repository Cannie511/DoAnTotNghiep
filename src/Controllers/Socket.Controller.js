
const Socket = require('../Services/Socket.Service');
const { handleError } = require('../Utils/Http');
class SocketController{
    constructor(req, res){
        this.req = req;
        this.res = res;
    }

    getActiveStatus = async()=>{
        try {
            const { user_id } = this.req.body;
            const SocketService = new Socket();
            const socket = await SocketService.searchOne(user_id);
            if (socket)
              return this.res.status(socket.status).json(socket);
        } catch (error) {
            const err = handleError(error);
            return this.res.status(err.status).json({ message: err.message });
        }
    }
}

module.exports = SocketController;