const { LoginService, checkEmailService, checkSessionService, GoogleLoginService, LogoutService } = require("../Services/Auth.Service");
const { sendMailService, verifyEmailService } = require("../Services/Email.Service");
const { addUsersService } = require("../Services/User.Service");
const { createKey, createRefreshKey } = require("../Services/jwt");
const { generateCode, listVerificationCode } = require("../Utils/CodeGenerate");
const { hashPassword } = require("../Utils/HashPassword");
const { handleError } = require("../Utils/Http");
const validateEmail = require("../Utils/validateEmail");

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await LoginService(username, password);
    if (data && data.status === 200 && data.access_token) {
      res.cookie("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax",
      });
      res.cookie("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }
    return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};

const checkEmailController = async(req, res)=>{
  try {
    const {email} = req.body;
    if(validateEmail(email)===false) return res.status(422).json({message:"Vui lòng nhập đúng định dạng email"});
    const data = await checkEmailService(email);
    if(data) return res.status(data.status).json(data)
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
}

const GoogleLoginController = async (req, res) => {
  try {
    const { google_token } = req.body;
    const data = await GoogleLoginService(google_token);
    if(data){
      res.cookie("access_token", data.data.access_token.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      res.cookie("refresh_token", data.data.refresh_token.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return res.status(data.status).json(data);
    }
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};

const checkSessionController = async(req, res)=>{
  try {
    const { access_token } = req.body || req.cookies;
    const data = await checkSessionService(access_token);
    if(data) res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
}

const sendEmailController = async(req, res)=>{
  try {
    const { email, subject } = req.body;
    const verificationCode = generateCode(email);
    if(verificationCode !== null){
      const data = await sendMailService(email, verificationCode, subject);
      if (data) return res.status(data.status).json(data);
    }
    return res.status(500).json({message:"Mã code không được rỗng"});
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
}

const verifyEmailController = async(req, res)=>{
  try {
    const { email, code } = req.body;
    const data = await verifyEmailService(email,code);
    if(data) return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
}

const logOutController = async(req,res)=>{
  try {
     const { user_id } = req.body;
     const { refresh_token } = req.cookies;
     if(!user_id) return res.status(403).json({message: "user_id không được bỏ trống"});
     if (!refresh_token)
       return res.status(403).json({ message: "Token not found" });
     const data = await LogoutService(refresh_token, user_id);
     if (data.status === 200){
      res.cookie("access_token", '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge:0,
      });
      res.cookie("refresh_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
      });
     } return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
}

const registerController = async (req, res) => {
  const { email, password, display_name, language, premium, linked_account } =
    req.body;
  if (!email) return res.status(422).json({ message: "email không được để trống" });
  if (validateEmail(email) === false)
    return res
      .status(422)
      .json({ message: "Vui lòng nhập đúng định dạng email" });
  const hashPass = hashPassword(password);
  try {
    const data = await addUsersService(
      email,
      hashPass,
      display_name,
      language,
      premium,
      linked_account
    );
    console.log(data)
    if (data && data.status === 200) {
      console.log('id user: ',data.data.data.id);
      const access_token = await createKey({id:data.data.data.id, email, display_name });
      const refresh_token = await createRefreshKey({
        id: data.data.data.id,
        email,
        display_name,
      });
      console.log(refresh_token)
      res.cookie("access_token", access_token.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      res.cookie("refresh_token",refresh_token.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return res
        .status(data.status)
        .json({ ...data, access_token: access_token.token });
    }
    return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};
module.exports = {
  loginController,
  registerController,
  checkEmailController,
  checkSessionController,
  GoogleLoginController,
  logOutController,
  sendEmailController,
  verifyEmailController,
};
