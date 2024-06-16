const { createKey, createRefreshKey, checkKey } = require("./jwt");
const Model = require('../models');
const { checkPassword } = require("../Utils/HashPassword");
const { handleResult, handleError } = require("../Utils/Http");
const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");
const checkEmailService = async(email)=>{
  try {
    if(!email) handleResult(422,'Email is required');
    const account_user = await Model.User.findOne({
      where: {
        email: email,
      },
      raw: true,
    });
    if(account_user) return handleResult(200, 'get Email successfully');
    return handleResult(422, "Email not found");
  } catch (error) {
    return handleError(error)
  }
}

const checkSessionService = async(token)=>{
  try {
    if(!token) return handleResult(422, "Token not found");
    const data = await checkKey(token)
    if(data) return handleResult(200, "Session is valid");
    else return handleResult(401, "Unauthorized");
  } catch (error) {
    return handleError(error);
  }
}

const GoogleLoginService = async(token) =>{
  try {
    if(!token) return handleResult(422, "Token not found");
    const data = await jwtDecode(token);
    if (data) return handleResult(200, "login with google successfully", data);
    else return handleResult(401, "Unauthorized");
  } catch (error) {
    return handleError(error);
  }
}

const LoginService = async (username, password)=>{
  try {
    if (!username || !password) {
      return handleResult(422, "username or password is required");
    }
    const account_user = await Model.User.findOne({
      where: {
        email: username,
      },
      raw: true,
    });
    if (account_user) {
      if(checkPassword(password, account_user.password)){
          const access_token = await createKey({id:account_user.id, username, email:account_user.email, display_name: account_user.display_name});
          const refresh_token = await createRefreshKey({id:account_user.id, username, email:account_user.email, display_name: account_user.display_name});
          return {
            status: 200,
            message: "Login successfully",
            access_token: access_token.token,
            refresh_token: refresh_token.token,
            data: {
              id: account_user?.id,
              email: account_user?.email,
              display_name: account_user?.display_name,
              language: account_user?.language,
              premium: account_user?.premium,
            },
          };
        }
        else{
            return handleResult(422, "username or password is incorrect");
        }
      }
  } catch (error) {
      return handleError(error);
  }
}

module.exports = {
  LoginService,
  checkEmailService,
  checkSessionService,
  GoogleLoginService,
};