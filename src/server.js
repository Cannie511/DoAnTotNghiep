const express = require("express");
const app = express();
const Authentication = require("./Middlewares/Authentication");
const cookieParser = require("cookie-parser");
const AuthRoute = require("./Routes/Auth.api");
const UserRoute = require("./Routes/User.api");
const MessageRoute = require("./Routes/Message.api");
const RoomRoute = require("./Routes/Room.api");
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
const { addFriend, agreeAddFriend, getUsersByIdService } = require("./Services/User.Service");
const { getUserByIdController, addFriendController } = require("./Controllers/User.Controller");
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



const client = {}
//Gửi lời mời kết bạn
io.on('connection', (socket) => {
    console.log('New client connected');
  
    socket.on('friend_request', async (data) => {
       const addFriends = await  addFriendController (
        data.userId,
        data.friend_id
       )
      console.log('Friend request received: ', data);
      // Gửi thông báo lại cho client
      if(addFriends.status === 200)
        {
          const dataUser = await getUserByIdController(data.userId)
          client[data.friend_id].emit('notification',dataUser );

         delete client[data.friend_id];
        }
      
    });
  

  });
 //phản hồi addFreiend
 
 io.on('connection', (socket) => {
  console.log('New client connected');

 
  socket.on('friend_response', async (data) => {
     const addFriends = await  agreeAddFriend (
      data.userId,
      data.friend_id,
      data.action
     )
    console.log('response: ', data);
    // Gửi thông báo lại cho client
    if(addFriends.status === 200)
      {

       const dataUser = await getUsersByIdService(data.userId) 
       client[data.userId].emit('notification_response', dataUser);

       delete client[data.userId];
      }
    
  });


});


app.use("/auth", AuthRoute);
app.use("/api", MessageRoute);
app.use("/api", Authentication, UserRoute);
app.use("/api", Authentication, RoomRoute);

app.use((req, res) => {
  res.status(404).json({ status: 404, message: "404 NOT FOUND" });
});
server.listen(port, () => {
  console.log(
    `[Đồ án tốt nghiệp] is running on port ${port}, domain: http://localhost:${port}`
  );
});
