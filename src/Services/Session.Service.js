const { handleResult, handleError } = require('../Utils/Http');
const Model = require('../models');

const addSessionService = async (user_id, token)=>{
    try {
        const data = await Model.Session.create({
            token,
            user_id,
        });
        if (!data) return handleResult(400, "Tạo session thất bại");
        return handleResult(200, "Tạo session thành công");
    } catch (error) {
        return handleError(error);
    }
}

const updateSessionService = async(user_id, token)=>{
    try {
        const data = await Model.Session.findOne({
            where:{
                user_id:user_id
            },
            raw:true
        })
        if(data){
            const updateSession = await Model.Session.update({
                token:token
            },
            {
                where:{
                    user_id: data?.user_id
                },
                raw:true
            });
            if(+updateSession === 1) return handleResult(200,"Cập nhật Session thành công!");
            return handleResult(405, "Cập nhật Session thất bại!");
        }
        return handleResult(422, "Người dùng không tồn tại");
    } catch (error) {
        return handleError(error);
    }
}

const deleteSessionService = async(user_id, token)=>{
    try {
        const isExists = await Model.Session.findOne({
          where: {
            user_id: user_id,
            token:token,
          },
          raw: true,
        });
        if(isExists){
            const deleteSession = await Model.Session.destroy({
              where: {
                id: isExists.id,
                token: token,
              },
            });
            if (deleteSession !== 1) {
              return handleResult(400, "Xóa session thất bại!");
            }
             return handleResult(200, "Xóa session thành công!");
        }
    } catch (error) {
        return handleError(error)
    }
}

module.exports = {
  addSessionService,
  updateSessionService,
  deleteSessionService,
};