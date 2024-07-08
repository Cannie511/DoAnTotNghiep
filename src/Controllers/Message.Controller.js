const { getMessageService, getLatestMessageService } = require("../Services/Message.Service");
const { handleError } = require("../Utils/Http");

const getMessageController = async (req, res)=>{
    try {
        let { user1, user2 } = req.body;
        user1 = Number(user1);
        user2 = Number(user2);
        const data = await getMessageService(user1, user2);
        if (data) return res.status(data.status).json(data);
    } catch (error) {
        const err = handleError(error);
        return res.status(err.status).json({ message: err.message });
    }
}

const getLatestMessageController = async(req, res)=>{
    try {
      let { userId } = req.body;
      userId = Number(userId);
      const data = await getLatestMessageService(userId);
      if (data) return res.status(data.status).json(data);
    } catch (error) {
      const err = handleError(error);
      return res.status(err.status).json({ message: err.message });
    }
}


module.exports = { getMessageController, getLatestMessageController };