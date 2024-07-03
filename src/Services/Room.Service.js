const { Op } = require("sequelize");
const { handleResult, handleError } = require("../Utils/Http");
const Model = require("../models");
const moment = require("moment-timezone");
//chưa test
const CreateRoomService = async(host_ID) =>
    {
        const currentTime = new Date();
        const endTime = new Date(currentTime.getTime() + 45 * 60 * 1000);
        try{
            const user = await Model.User.findOne({
                attributes: [
                  "premium",
                ],
                where: {
                  id: host_ID,
                },
                raw: true,
              });
              const premium = user.premium
              let data;
              if(premium == 0)
                {  data = await Model.Rooms.create({
                User_amount:60,
                Host_id:host_ID,
                Create_by:host_ID,
                Time_start:currentTime ,
                Time_end:endTime
            })}
                else 
                {
                     data = await Model.Rooms.create({
                        User_amount:100,
                        Host_id:host_ID,
                        Create_by:host_ID,
                        Time_start:currentTime,
                        
                })}
            if (data)
                return handleResult(200, "Create room successfully",  data);
            return handleResult(400, "Create room error");
        }catch(error){
            return err = handleError(error);
        }
    }

const createScheduleService = async(user_id,time)=>
    {
          try{
            const endTime = new Date( time+ 45 * 60 * 1000);
            const user = await Model.User.findOne({
                attributes: [
                  "premium",
                ],
                where: {
                  id: user_id,
                },
                raw: true,
              });
              const premium = user.premium
              let data;
              if(premium == 0)
                {  data = await Model.Rooms.create({
                User_amount:60,
                Host_id:user_id,
                Create_by:user_id,
                Time_start:time ,
                Time_end:endTime
            })}
                else 
                {
                     data = await Model.Rooms.create({
                        User_amount:100,
                        Host_id:user_id,
                        Create_by:user_id,
                        Time_start:time,
                        
                })}
            
           
            const room_Id = data.id;
            const Schedule = await Model.SCHEDULE.create ({
                User_ID:user_id,
                Room_ID:room_Id,
                Time:time
            });
            if (Schedule)
                return handleResult(200, "Create Schedule successfully", Schedule);
            return handleResult(400, "Create Schedule error");
              
          }catch(error)
          {
            return err = handleError(error);
          }
    }
    module.exports = {
        CreateRoomService,
        createScheduleService
      };