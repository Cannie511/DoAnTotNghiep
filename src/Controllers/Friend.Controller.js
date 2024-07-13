const { Op } = require("sequelize");
const Model = require('../models');
const {
        findUserByName,
        addFriend,
        deleteFriend,
        getAllFriend,
        agreeAddFriend,
        getInfoAllFriend
} = require("../Services/Friend.Service");
const { handleError } = require("../Utils/Http");
const pagination = require("../Utils/Pagination");
const LIMIT = +process.env.LIMIT_RECORD;
// tìm bạn theo tên

const findFriendController = async (req, res) => {
    try {
      const {name} = req.body;
      console.log(name);
      if (!name)
        return res.status(422).json({ message: "Từ khóa không được để trống" });
      const data = await findUserByName(name);
      if (data) return res.status(data.status).json(data);
    } catch (error) {
      const err = handleError(error);
      return res.status(err.status).json({ message: err.message });
    }
  };
  // Thêm bạn
  const addFriendController = async(req,res) =>
    {
      
      try {
      const {user_id} =req.body;
      const {friend_id} = req.body;
        const data = await addFriend(user_id,friend_id);
        if(data) return res.status(data.status).json(data);
      }catch(error)
      {
        const err = handleError(error);
        return res.status(er.status).json({message: err.message})
      }
    }
  //Xóa kết bạn
  const deleteFriendController = async(req,res) =>
    {
      try{
        const {user_id} =req.body;
        const {friend_id} = req.body;
        console.log(friend_id);
      if(!user_id) return res.status(422).json({message:"Không nhận được user_id"});
      if(!friend_id) return res.status(422).json({message:"Không nhận được friend_id"});
        const data = await deleteFriend(user_id,friend_id);
        if (data) return res.status(data.status).json(data);
      }catch(error)
      {
        const err = handleError(error);
        return res.status(er.status).json({message: err.message})
      }
    }
  
  // hiện toàn bộ bạn bè
  const getAllFriendController = async(req,res)=>
    {
      try
      {
        const { page } = req.query;
        const {user_id} =req.params;
        const whereCondition = {
          User_ID: user_id,
          status: 1
        };
        const totalRecords = await  Model.USER_FRIEND.count({where: whereCondition});
        const totalPages = Math.ceil(totalRecords / LIMIT);
        const paginate = await pagination("USER_FRIEND",{},totalPages,whereCondition,[])
        if(!user_id) return res.status(422).json({message:"Không nhận được user_id"})
        if(paginate) return res.status(paginate.status).json(paginate);
      }catch(error)
      {
        const err = handleError(error);
        return res.status(err.status).json({ message: err.message });
      }
    }

    module.exports = 
    {
        findFriendController,
        addFriendController,
        deleteFriendController,
        getAllFriendController
    };