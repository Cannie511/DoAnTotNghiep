const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { checkKey } = require("../Services/jwt");
require('dotenv').config();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var Authentication = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) res.status(403).json({message:'Token not found'});
    const data = await checkKey(token);
    console.log('data: ',data.status)
    if(data.status !== 200)
    res.status(data.status).json(data);
    else if(data.status === 200)
    next();
  } catch (error) {
    console.log(error)
    res.status(500).json({message:error.message});
  }
};
module.exports = Authentication;
