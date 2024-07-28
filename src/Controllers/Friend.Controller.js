const Model = require("../models");
const {
  findUserByName,
  addFriend,
  deleteFriend,
  suggestAddFriend
} = require("../Services/Friend.Service");
const { handleError } = require("../Utils/Http");
const pagination = require("../Utils/Pagination");

const { Sequelize, Op } = require('sequelize'); 

const findFriendController = async (req, res) => {
  try {
    const { name } = req.body;
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
const addFriendController = async (req, res) => {
  try {
    const { friend_id, user_id } = req.body;
    const data = await addFriend(user_id, friend_id);
    if (data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(er.status).json({ message: err.message });
  }
};
//Xóa kết bạn
const deleteFriendController = async (req, res) => {
  try {
    const { user_id } = req.body;
    const { friend_id } = req.body;
    console.log(friend_id);
    if (!user_id)
      return res.status(422).json({ message: "Không nhận được user_id" });
    if (!friend_id)
      return res.status(422).json({ message: "Không nhận được friend_id" });
    const data = await deleteFriend(user_id, friend_id);
    if (data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(er.status).json({ message: err.message });
  }
};

// hiện toàn bộ bạn bè
const getAllFriendController = async (req, res) => {
  try {
    let { page } = req.query;
    if(!page) page = 1;
    const { user_id, status } = req.params;
    const whereCondition = {
      User_ID: user_id,
      status: status,
    };
    const include = [
      {
        model: Model.User,
        as: "Friend",
        attributes: ["display_name", "avatar"],
      },
    ];
    const paginate = await pagination(
      "USER_FRIEND",
      {},
      page,
      whereCondition,
      [["createdAt", "ASC"]],
      include
    );
    if (!user_id)
      return res.status(422).json({ message: "Không nhận được user_id" });
    if (paginate) return res.status(paginate.status).json(paginate);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};

const getSuggestAddFriendController = async(req,res)=>
{
  try {
    let { page } = req.query;
    if(!page) page = 1;
    const {user_id} = req.params;
    // console.log(user_id);
    // const data =await suggestAddFriend(user_id);
    // return res.status(data.status).json(data);
    const whereCondition = {
      id: {
        [Op.notIn]: [
          Sequelize.literal(`
            SELECT user_friend.User_ID FROM user_friend WHERE user_friend.Friend_ID = ${user_id}
            UNION
            SELECT user_friend.Friend_ID FROM user_friend WHERE user_friend.User_ID = ${user_id}
          `)
        ],
        [Op.ne]: user_id
      }
    };
    const attr = [
      "id",
      "email",
      "display_name",
      "avatar",
    ];
 
    const paginate = await pagination(
      "User",
      attr,
      page,
      whereCondition,
      [],
      [],
    );
   
    if (!user_id)
      return res.status(422).json({ message: "Không nhận được user_id" });
    if (paginate) return res.status(paginate.status).json(paginate);

  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
}
module.exports = {
  findFriendController,
  addFriendController,
  deleteFriendController,
  getAllFriendController,
  getSuggestAddFriendController
};
