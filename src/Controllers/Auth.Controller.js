const { LoginService } = require("../Services/Auth.Service");
const { addUsersService } = require("../Services/User.Service");
const { createKey } = require("../Services/jwt");
const { hashPassword } = require("../Utils/HashPassword");
const { handleError } = require("../Utils/HttpError");

const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const data = await LoginService(username, password);
        if(data && data.status === 200 && data.access_token){
            res.setHeader(
                "Set-Cookie",
                `access_token=${data.access_token};HttpOnly;Path=/`
            );
        }
        return res.status(data.status).json(data);
    } catch (error) {
        const err = handleError(error);
        return res.status(err.status).json({ message: err.message });
    }
};

const registerController = async (req, res) => {
  const { email, password, display_name, language, premium, linked_account } = req.body;
  if(!email)
    return res
      .status(422)
      .json({message:"email is required"});
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
    if (data && data.status === 200){
        const access_token = createKey({email})
        return res.status(data.status).json({...data, access_token: access_token.token});
    } 
    return res.status(data.status).json(data);
  } catch (error) {
    const err = handleError(error);
    return res.status(err.status).json({ message: err.message });
  }
};
module.exports = { loginController, registerController };