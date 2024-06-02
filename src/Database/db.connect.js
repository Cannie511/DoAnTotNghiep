const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("db_doantotnghiep", "root", "", {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 1000,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectToDatabase = async(req, res, next)=>{
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
    next();
}

module.exports = connectToDatabase;

 