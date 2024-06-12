const jwt = require("jsonwebtoken");
const { handleError } = require("../Utils/Http");
require("dotenv").config();
const secret_key = process.env.ACCESS_TOKEN_SECRET_KEY;
const refresh_key = process.env.REFRESH_TOKEN_SECRET_KEY;
const exp = process.env.EXPIRED_TIME;
const createKey = (payload) => {
  try {
    if (!payload)
      return {
        status: 403,
        message: "payload not found",
        token: "",
      };
    const token = jwt.sign(payload, secret_key, { expiresIn: exp });
    return {
      status: 200,
      message: "create token successfully",
      token,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Server Error",
      token: "",
    };
  }
};

const createRefreshKey = (payload) => {
  try {
    if (!payload)
      return {
        status: 403,
        message: "payload not found",
        token: "",
      };
    const token = jwt.sign(payload, refresh_key);
    return {
      status: 200,
      message: "create token successfully",
      token,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Server Error",
      token: "",
    };
  }
};

const checkKey = async (token) => {
  try {
    if (!token)
      return {
        status: 403,
        message: "token not found",
      };
    else {
      const data = jwt.verify(token, secret_key, true);
      if (data) {
        return {
          status: 200,
          message: "verify successfully",
        };
      }
    }
  } catch (error) {
    handleError(error);
    return {
      status: 401,
      message: "Unauthorized",
    };
  }
};
module.exports = { createKey, checkKey, createRefreshKey };
