const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { checkKey, checkRefreshKey, createKey } = require("../Services/jwt");
const Model = require('../models');
require('dotenv').config();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var Authentication = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    const rf_tk = req.cookies.refresh_token;
    if (!token) 
     return res.status(403).json({message:'Token not found'});
    const data = await checkKey(token);
    if(data.status !== 200)
    {
      if(!rf_tk) return res.status(403).json({ message: "Rf_Token not found" });
      else {
        const data = await Model.Session.findOne({
          where: {
            token: rf_tk,
          }
        })
        if(data){
          const session_data = await checkRefreshKey(rf_tk);
          //console.log("session data: ",session_data)
          if(session_data.status!==200){
            return res.status(403).json({ message: "Rf_Token is invalid" });
          }
          else {
            const access_token = createKey({session_data})
            res.cookie("access_token", access_token.token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            });
            res.cookie("refresh_token", rf_tk, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            });
            next();
          }
        }
        else{
          return res.status(403).json({ message: "Session is invalid" });
        }
      }
    }
    else
      next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:error.message});
  }
};
module.exports = Authentication;
