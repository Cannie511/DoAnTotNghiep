const { getMessageService, getLatestMessageService } = require("../Services/Message.Service");
const { handleError } = require("../Utils/Http");
const { Op } = require("sequelize");
const pagination = require("../Utils/Pagination");
const Model = require('../models');
require("dotenv").config();
const LIMIT = +process.env.LIMIT_RECORD;

const getMessageController = async (req, res)=>{
    try {
        let { user1, user2 } = req.body;
        user1 = Number(user1);
        user2 = Number(user2);
        const whereCondition = {
          [Op.or]: [
            {
              [Op.and]: [{ Send_by: user1 }, { Received_by: user2 }],
            },
            {
              [Op.and]: [{ Send_by: user2 }, { Received_by: user1 }],
            },
          ],
        };
        const order = [["createdAt", "ASC"]];
        const totalRecords = await Model.MESSAGE.count({ where: whereCondition });
        const totalPages = Math.ceil(totalRecords / LIMIT);
        console.log(totalRecords);
        const paginate = await pagination("MESSAGE",{}, totalPages, whereCondition,order);
        console.log(paginate);
        if (paginate) return res.status(paginate.status).json(paginate);
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