const { createKey } = require("./jwt");

const db_account = [
  { id:1, username: "Canh51102@gmail.com", password: "abc123" },
  { id:2, username: "user1@gmail.com", password: "abc123" },
  { id:3, username: "user2@gmail.com", password: "abc123" },
];
const LoginService = async (username, password)=>{
    try {
        if (!username || !password) {
          return {
            status: 403,
            message: "username or password is required",
          };
        }
        const account_user = db_account.find(
          (item) => item.username === username
        );
        if (account_user) {
            if(password === account_user.password){
                const access_token = await createKey({username});
                return {
                  status: 200,
                  message: "Login successfully",
                  access_token:access_token.token
                };
            }
            else{
                return {
                  status: 401,
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