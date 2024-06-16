const { LoginService, checkEmailService, checkSessionService, GoogleLoginService } = require("../Services/Auth.Service");
const { addUsersService } = require("../Services/User.Service");
const { createKey } = require("../Services/jwt");
const { hashPassword } = require("../Utils/HashPassword");
const { handleError } = require("../Utils/Http");

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
    console.log('email:', email);
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
    if (data) return res.status(data.status).json(data);
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

const registerController = async (req, res) => {
  const { email, password, display_name, language, premium, linked_account } =
    req.body;
  if (!email) return res.status(422).json({ message: "email is required" });
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
    if (data && data.status === 200) {
      const access_token = createKey({ email, display_name,language, premium });
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
};
