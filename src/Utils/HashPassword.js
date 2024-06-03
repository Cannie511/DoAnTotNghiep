const bcrypt = require("bcrypt");
const saltRounds = 9;
const salt = bcrypt.genSaltSync(saltRounds);

const hashPassword = (password) => {
    try {
        if (!password) {
          return new Error("Password is required");
        } else {
          const passwordHashed = bcrypt.hashSync(password, salt);
          return passwordHashed;
        }
    } catch (error) {
        throw new Error("Sever Error");
    }
};

const checkPassword = (password, hashPassword) => {
  try {
    if (!password || !hashPassword) {
      throw new Error("Password and hashPassword is required");
    } else {
      const check = bcrypt.compareSync(password, hashPassword);
      return check;
    }
  } catch (error) {
    throw new Error(error.message);   
  }
};
module.exports = { hashPassword, checkPassword };
