const { LoginService } = require("../Services/Auth.Service");

const AuthController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const data = await LoginService(username, password);
        res.setHeader(
          "Set-Cookie",
          `access_token=${data.access_token};HttpOnly;Path=/`
        );
        return res.status(data.status).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'Server Error'});
    }
};
module.exports = {AuthController}