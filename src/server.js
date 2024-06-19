const express = require('express');
const app = express();
const Authentication = require('./Middlewares/Authentication')
const cookieParser = require("cookie-parser");
const AuthRoute = require('./Routes/Auth.api');
const UserRoute = require('./Routes/User.api');
const db_connect = require('./Database/db.connect');
const { hashPassword, checkPassword } = require('./Utils/HashPassword');
const cors_config = require('./Middlewares/CORS')
const io = require('socket.io');
const { generateCode } = require('./Utils/CodeGenerate');
require("dotenv").config();

app.use(cors_config);
app.use(db_connect);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//PORT SERVER
const port = process.env.PORT || 5000;
let code = '';
//route test
app.get('/', async(req, res)=>{ 
    code = generateCode();
    return res.status(200).json({
     code
    });
});

app.post("/verify", async (req, res) => {
  const {verificationCode} = req.body;
  if(verificationCode === code)
  return res.status(200).json({
    message:"verify successfully",
  });
  return res.status(403).json({
    message: "verify code is incorrect",
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