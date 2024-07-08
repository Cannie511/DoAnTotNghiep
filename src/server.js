const express = require("express");
const app = express();
const Authentication = require("./Middlewares/Authentication");
const cookieParser = require("cookie-parser");
const AuthRoute = require("./Routes/Auth.api");
const UserRoute = require("./Routes/User.api");
const MessageRoute = require("./Routes/Message.api");
const RoomRoute = require("./Routes/Room.api");
const db_connect = require("./Database/db.connect");
const cors_config = require("./Middlewares/CORS");
const { Server } = require("socket.io");
const { createServer } = require("node:http");

const {
  saveMessageService,
  getMessageService,
  getLatestMessageService,
} = require("./Services/Message.Service");
const { addFriend, agreeAddFriend, getUsersByIdService } = require("./Services/User.Service");
const { getUserByIdController, addFriendController } = require("./Controllers/User.Controller");
const Socket = require("./Services/Socket.Service");
const socket = require("./models/socket");
const { handleError } = require("./Utils/Http");
require("dotenv").config();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.172"],
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
io.on("connection", async (socket) => {
  try {
    const user_id = socket.handshake.query.user_id;
    console.log(`${user_id} have connected ${socket.id}`);
    if (!user_id) return;
    const socketIO = new Socket(user_id, socket.id, 1);
    await socketIO.connectSocket();
    socket.on("chat", async (data) => {
      const received_user = await socketIO.searchOne(data?.receivedBy);
      const send_user = await socketIO.searchOne(data?.sendBy);
      console.log("received: ", received_user.data.socket_id);
      const response = await saveMessageService(
        data?.message,
        data?.sendBy,
        data?.receivedBy
      );
      if (response?.status === 200) {
        const listMessage = await getMessageService(
          data?.sendBy,
          data?.receivedBy
        );
        io.to(received_user?.data.socket_id).emit("onChat", listMessage);
        io.to(send_user?.data.socket_id).emit("onChat", listMessage);
      }
    });
  } catch (error) {
    return handleError(error);
  }
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

app.post("/", async(req, res)=>{
  try {
    const {userId} = req.body;
    const data = await getLatestMessageService(userId);
    if(data) return res.status(data.status).json(data);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
})
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
