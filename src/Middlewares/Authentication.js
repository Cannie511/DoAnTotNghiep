const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { checkKey } = require("../Services/jwt");
require('dotenv').config();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var Authentication = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) 
     return res.status(403).json({message:'Unauthorized'});
    const data = await checkKey(token);
    if(data.status !== 200)
     return res.status(data.status).json(data);
    else
      next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:error.message});
  }
};
module.exports = Authentication;
