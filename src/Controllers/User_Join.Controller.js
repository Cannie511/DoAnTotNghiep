const UserJoin = require("../Services/User_Join.Service");
const { handleError } = require("../Utils/Http");
class UserJoinController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  findAll = async () => {
    try {
      const { user_id, room_id } = this.req.params;
      const userJoinService = new UserJoin(user_id,room_id);
      const userJoin = await userJoinService.find();
      if (userJoin) return this.res.status(userJoin.status).json(userJoin.data);
    } catch (error) {
      const err = handleError(error);
      return this.res.status(err.status).json({ message: err.message });
    }
  };

  create = async () => {
    try {
      const { user_id, room_id } = this.req.body;
      if(!user_id || !room_id) return this.res.status(422).json({message: "Các trường đều bắt buộc"});
      const userJoinService = new UserJoin(user_id, room_id);
      const userJoin = await userJoinService.findOne();
      if (userJoin.status !== 200) {
        const joinIn = await userJoinService.create();
        if (joinIn) return this.res.status(userJoin.status).json(userJoin.data);
      } else return this.res.status(200).json({message: "Người dùng đã tham gia phòng này"});
    } catch (error) {
      const err = handleError(error);
      return this.res.status(err.status).json({ message: err.message });
    }
  };

  delete = async () => {
    try {
      const { user_id, room_id } = this.req.params;
      const userJoinService = new UserJoin(user_id, room_id);
      const userJoin = await userJoinService.find(room_id, user_id);
      if (userJoin.status === 200) {
        const joinIn = await userJoinService.delete();
        if (joinIn) return this.res.status(userJoin.status).json(userJoin.data);
      } else
        return this.res
          .status(422)
          .json({ message: "Người dùng không ở trong phòng" });
    } catch (error) {
      const err = handleError(error);
      return this.res.status(err.status).json({ message: err.message });
    }
  };
}

module.exports = UserJoinController;
