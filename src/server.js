const express = require('express');
const app = express();
const Authentication = require('./Middlewares/Authentication')
const cookieParser = require("cookie-parser");
const AuthRoute = require('./Routes/Auth.api');
const UserRoute = require('./Routes/User.api');
const db_connect = require('./Database/db.connect');
const { hashPassword, checkPassword } = require('./Utils/HashPassword');
const cors_config = require('./Middlewares/CORS')
const io = require('socket.io')
require("dotenv").config();

app.use(cors_config);
app.use(db_connect);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//PORT SERVER
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
app.use((req, res) => {
  res.status(404).json({status: 404, message:"404 NOT FOUND"})
});
app.listen(port, ()=>{
    console.log(`[Đồ án tốt nghiệp] is running on port ${port}, domain: http://localhost:${port}`)
})