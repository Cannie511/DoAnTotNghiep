const { createScheduleService, getScheduleService, deleteScheduleService } = require("../Services/Schedule.Service");

const createScheduleController = async (req, res) => {
  try {
    const { user_id, time, password, roomKey } = req.body;
    const data = await createScheduleService(user_id, time, password, roomKey);
    if (data) return res.status(data.status).json(data.data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};

const getScheduleController = async(req, res)=>{
  try {
    const { user_id, timeDiff } = req.body;
    const data = await getScheduleService(user_id, timeDiff);
    if (data) return res.status(data.status).json(data.data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
}

const deleteScheduleController = async(req, res)=>{
   try {
     const { schedule_id } = req.params;
     const data = await deleteScheduleService(schedule_id);
     if (data) return res.status(data.status).json(data.data);
   } catch (error) {
     const err = handleError(error);
     return res.status(err.status).json({ message: err.message });
   }
}

module.exports = {
  createScheduleController,
  getScheduleController,
  deleteScheduleController,
};