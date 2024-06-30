const express = require("express");
const app = express();
const Authentication = require("./Middlewares/Authentication");
const cookieParser = require("cookie-parser");
const AuthRoute = require("./Routes/Auth.api");
const UserRoute = require("./Routes/User.api");
const MessageRoute = require("./Routes/Message.api");
const db_connect = require("./Database/db.connect");
const { hashPassword, checkPassword } = require("./Utils/HashPassword");
const cors_config = require("./Middlewares/CORS");
const { Server } = require("socket.io");
const { generateCode } = require("./Utils/CodeGenerate");
const validateEmail = require("./Utils/validateEmail");
const { createServer } = require("node:http");
const {
  saveMessageService,
  getMessageService,
} = require("./Services/Message.Service");
require("dotenv").config();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
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
io.on("connection", (socket) => {
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log("user join room:", room);
    });
    socket.on("chat", async (data) => {
      console.log("socket chat", data);
      const response = await saveMessageService(
        data?.message,
        data?.sendBy,
        data?.receivedBy
      );
      console.log(response);
      if (response?.status === 200) {
        const listMessage = await getMessageService(
          data?.sendBy,
          data?.receivedBy
        );
        console.log(listMessage);
        io.to(data.sendBy + data.receivedBy).emit("onChat", listMessage);
        //socket.emit("onChat", response.status);
      }
    });
});
app.use("/auth", AuthRoute);
app.use("/api", MessageRoute);
app.use("/api", Authentication, UserRoute);

app.use((req, res) => {
  res.status(404).json({ status: 404, message: "404 NOT FOUND" });
});
server.listen(port, () => {
  console.log(
    `[Đồ án tốt nghiệp] is running on port ${port}, domain: http://localhost:${port}`
  );
});
