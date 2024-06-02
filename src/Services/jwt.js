const jwt = require('jsonwebtoken')
require('dotenv').config();
const secret_key = process.env.ACCESS_TOKEN_SECRET_KEY;
const exp = process.env.EXPIRED_TIME;
const createKey = (payload)=>{
    try {
        if(!payload) 
            return {
              status: 403,
              message: "payload not found",
              token:''
            };
       const token = jwt.sign(payload, secret_key, { expiresIn:exp });
       return {
         status: 200,
         message: "create token successfully",
         token
       };
    } catch (error) {
        console.log(error);
        return {
          status: 500,
          message: "Server Error",
          token:''
        };
    }
}

const checkKey = (token) =>{
    try {
        if(!token)
        return {
            status: 403,
            message: "token not found"
        }
        jwt.verify(token, secret_key, (err, data)=>{
            if (err)
            return {
                status: 401,
                message: err,
            };
        });
         return {
           status: 200,
           message: "verify successfully",
         };
    } catch (error) {
        console.log(error);
        return {
          status: 500,
          message: error,
        };
    }
}
module.exports = { createKey, checkKey };