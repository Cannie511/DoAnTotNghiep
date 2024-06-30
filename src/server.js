const express = require('express');
const app = express();
const Authentication = require('./Middlewares/Authentication')
const cookieParser = require("cookie-parser");
const AuthRoute = require('./Routes/Auth.api');
const UserRoute = require('./Routes/User.api');
const db_connect = require('./Database/db.connect');
const { hashPassword, checkPassword } = require('./Utils/HashPassword');
const cors_config = require('./Middlewares/CORS')
const {Server} = require('socket.io');
const { generateCode } = require('./Utils/CodeGenerate');
const validateEmail = require('./Utils/validateEmail');
const { createServer } = require("node:http");
require("dotenv").config();
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST","PUT","DELETE"],
  }});
app.use(cors_config);
app.use(db_connect);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//PORT SERVER
const port = process.env.PORT || 5000;

//route test
// app.get('/', async(req, res)=>{ 
//     code = generateCode();
//     return res.status(200).json({
//      code
//     });
// });
// app.post("/", async (req, res) => {
//   const {email} = req.body;
//   const validate = validateEmail(email);
//   return res.status(200).json({
//     validate,
//   });
// });
io.on("connection", (socket) => {
  console.log("a user connected");
});
app.use('/auth', AuthRoute);
app.use("/api", Authentication, UserRoute);
app.use((req, res) => {
  res.status(404).json({status: 404, message:"404 NOT FOUND"})
});
server.listen(port, () => {
  console.log(
    `[Đồ án tốt nghiệp] is running on port ${port}, domain: http://localhost:${port}`
  );
});