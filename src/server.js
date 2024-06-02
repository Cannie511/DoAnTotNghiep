const express = require('express');
const app = express();
const Authentication = require('./Middlewares/Authentication')
const cookieParser = require("cookie-parser");
const AuthRoute = require('./Routes/Auth.api')
const db_connect = require('./Database/db.connect');
const { hashPassword, checkPassword } = require('./Utils/HashPassword');
const Model = require("./models");
require("dotenv").config();


app.use(db_connect);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 5000;


//route test
app.get('/', Authentication, async(req, res)=>{ 
    const passwordHashed = hashPassword('abc123')
    const checkPW = checkPassword('abc123', passwordHashed)
    const list_account = await Model['User'].findAll({ raw: true });
    res.status(200).json({
      password: "abc",
      hashString: `->${passwordHashed}`,
      isCorrect: checkPW,
      users: list_account,
    });
});

app.use('/auth',AuthRoute);

app.use((req, res, next) => {
  res.status(404).send("404 Not Found")
});
app.listen(port, ()=>{
    console.log(`[Đồ án tốt nghiệp] is running on port ${port}, domain: http://localhost:${port}`)
})