const express = require('express');
const app = express();
const Authentication = require('./Middlewares/Authentication')
const cookieParser = require("cookie-parser");
const AuthRoute = require('./Routes/Auth.api');
const UserRoute = require('./Routes/User.api');
const db_connect = require('./Database/db.connect');
const { hashPassword, checkPassword } = require('./Utils/HashPassword');
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
    return res.status(200).json({
      password: "abc",
      hashString: `->${passwordHashed}`,
      isCorrect: checkPW,
    });
});

app.use('/auth', AuthRoute);
app.use("/api", Authentication, UserRoute);
app.use((req, res, next) => {
  res.status(404).send("404 Not Found")
});
app.listen(port, ()=>{
    console.log(`[Đồ án tốt nghiệp] is running on port ${port}, domain: http://localhost:${port}`)
})