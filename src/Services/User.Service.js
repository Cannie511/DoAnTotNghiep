const Model = require('../models');

const getUsersService = async() =>{
    try {
        const users = await Model.User.findAll({
          attributes:[
            "id","email","display_name","language","premium","linked_account","createdAt"
          ],
          raw: true,
        });
        if(!users)
            return {
              status: 400,
              message: "get user failed",
              data: []
            };
        return {
            status: 200,
            message: "get user successfully",
            data: users
        };
    } catch (error) {
        console.log(error.message);
        return {
          status: 500,
          message: error.message,
          data: [],
        };
    }
}

const addUsersService = async (email, password, display_name, language, premium, linked_account) => {
  try {
    const isExists = await Model.User.findOne({where: {
          email:email
      },raw:true
    })
    if(isExists)
        return {
          status: 405,
          message: "User is already exist! Try another email",
          data: [],
        };
    const users = await Model.User.create({
      email,
      password,
      display_name,
      language,
      premium,
      linked_account,
    });
    if (!users)
      return {
        status: 400,
        message: "add user failed",
        data: [],
      };
    return {
      status: 200,
      message: "add user successfully",
      data: users,
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: 500,
      message: error.message,
      data: [],
    };
  }
};

const updateUserService = async (
  password,
  display_name,
  language,
  premium,
  linked_account,
) => {
  try {
    const isExists = await Model.User.findOne({
      where: {
        email: email,
      },
      raw: true,
    });
    if (isExists)
      return {
        status: 405,
        message: "User is already exist! Try another email",
        data: [],
      };
    const users = await Model.User.create({
      email,
      password,
      display_name,
      language,
      premium,
      linked_account,
    });
    if (!users)
      return {
        status: 400,
        message: "add user failed",
        data: [],
      };
    return {
      status: 200,
      message: "add user successfully",
      data: users,
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: 500,
      message: error.message,
      data: [],
    };
  }
};

const deleteUserService = async (user_id) => {
  try {
    const isExists = await Model.User.findOne({
      where: {
        email: email,
      },
      raw: true,
    });
    if (isExists)
      return {
        status: 405,
        message: "User is already exist! Try another email",
        data: [],
      };
    const users = await Model.User.create({
      email,
      password,
      display_name,
      language,
      premium,
      linked_account,
    });
    if (!users)
      return {
        status: 400,
        message: "add user failed",
        data: [],
      };
    return {
      status: 200,
      message: "add user successfully",
      data: users,
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: 500,
      message: error.message,
      data: [],
    };
  }
};
module.exports = { getUsersService, addUsersService };