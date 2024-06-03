const { createKey } = require("./jwt");
const Model = require('../models');
const { checkPassword } = require("../Utils/HashPassword");
const LoginService = async (username, password)=>{
    try {
        if (!username || !password) {
          return {
            status: 403,
            message: "username or password is required",
          };
        }
        const account_user = await Model.User.findOne({
          where:{
            email:username
          }
          ,raw:true
        })
        if (account_user) {
            if(checkPassword(password, account_user.password)){
                const access_token = await createKey({id:account_user.id, username, email:account_user.email, display_name: account_user.display_name});
                return {
                  status: 200,
                  message: "Login successfully",
                  access_token:access_token.token
                };
            }
            else{
                return {
                  status: 422,
                  message: "username or password is incorrect",
                };
            }
        }
    } catch (error) {
        console.log(error);
        return {
          status: 500,
          message: error.message
        };
    }
    
}

module.exports = {LoginService}