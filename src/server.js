const express = require("express");
const app = express();
const Authentication = require("./Middlewares/Authentication");
const cookieParser = require("cookie-parser");
const AuthRoute = require("./Routes/Auth.api");
const UserRoute = require("./Routes/User.api");
const FriendRoute = require("./Routes/Friend.api");
const MessageRoute = require("./Routes/Message.api");
const SocketRoute = require("./Routes/Socket.api");
const NotificationRoute = require("./Routes/Notification.api");
const RoomRoute = require("./Routes/Room.api");
const ScheduleRoute = require("./Routes/Schedule.api");
const UserJoinRoute = require("./Routes/User_Join.api")
const RoomMessageRoute = require("./Routes/Room_Message.api");
const UserInvitationRoute = require("./Routes/User_Invitation.api");
const db_connect = require("./Database/db.connect");
const cors_config = require("./Middlewares/CORS");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const {
  saveMessageService,
  getMessageService,
} = require("./Services/Message.Service");
const { getUsersByIdService } = require("./Services/User.Service");
const Socket = require("./Services/Socket.Service");
const { handleError } = require("./Utils/Http");
const { addFriend, agreeAddFriend } = require("./Services/Friend.Service");
const NotificationService = require("./Services/Notification.Service");
const UserJoin = require("./Services/User_Join.Service");
const chalk = require("chalk");
const { findRoomService } = require("./Services/Room.Service");
const RoomMessage = require("./Services/Room_Message.Service");
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

const port = process.env.PORT || 5000;

io.on("connection", async (socket) => {
  try {
    const user_id = socket.handshake.query.user_id;

    socket.broadcast.emit("online", user_id);
    if (!user_id) return;

    const socketIO = new Socket(user_id, socket.id, 1);
    await socketIO.connectSocket();

    socket.on("onTyping", async (received_id, display_name) => {
      const received_user = await socketIO.searchOne(received_id);
      io.to(received_user?.data.socket_id).emit("typing", display_name);
    });

    socket.on("onStopTyping", async (received_id) => {
      const received_user = await socketIO.searchOne(received_id);
      io.to(received_user?.data.socket_id).emit("stopTyping");
    });

    socket.on("chat", async (data) => {
      const received_user = await socketIO.searchOne(data?.receivedBy);
      const send_user = await socketIO.searchOne(data?.sendBy);
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

    

    socket.on("join-in", async (roomKey, userId) => {
      //console.log(chalk.bgGreen(`${userId} joined room: - ${roomKey}`));
      await socket.join(roomKey)
      const room = await findRoomService(roomKey);
      const user_join = new UserJoin(userId, room?.data?.id);
      const find_user_join =  await user_join.findOne();
      const userData = await getUsersByIdService(userId);
      if(find_user_join.status !== 200){
        return;
      }
      socket.on("room-chat", async (data) => {
        const { room_id, user_id, message } = data;
        console.log(chalk.bgCyan(room_id, " - ", user_id, ": ", message));
        const room_message = new RoomMessage(room_id, user_id, message);
        await room_message.create()
        .then((data)=>{
          socket.to(roomKey).emit("room-chat", user_id, message);
        })
        .catch((err)=>{
          return handleError(err)
        })
      });
      socket.to(roomKey).emit("user-joinIn", userData.data);
      socket.on("share-screen", async (userId)=>{
        const user = await getUsersByIdService(userId);
        socket.to(roomKey).emit("share-screen", userId, user.data.display_name);
      })
      socket.on("stop-screen", async (userId)=>{
        console.log("stop-screen-id: ",userId)
        const user = await getUsersByIdService(userId);
        socket.to(roomKey).emit("stop-screen", userId, user.data.display_name);
      })
      socket.on("onMic", (roomId, userId) => {
        socket.to(roomId).emit("on-Mic", userId);
      });
      socket.on("offMic", (roomId, userId) => {
        socket.to(roomId).emit("off-Mic", userId);
      });
      socket.on("onCam", (roomId, userId) => {
        socket.to(roomId).emit("on-Cam", userId);
      });
      socket.on("offCam", (roomId, userId) => {
        socket.to(roomId).emit("off-Cam", userId);
      });
    });

    socket.on("user-left", async (userId, roomKey) => {
      const room = await findRoomService(roomKey);
      const userData = await getUsersByIdService(userId);
      const user_left = new UserJoin(userId, room?.data?.id);
      const find_user_left = await user_left.findOne();
      if (find_user_left.status !== 200) {
        socket.to(roomKey).emit("user-leftRoom", userData.data);
      } else return;
    });

    socket.on("friend_request", async (data) => {
      const addFriends = await addFriend(data.user_id, data.friend_id);
      if (addFriends.status === 200) {
        const received_user = await socketIO.searchOne(data?.friend_id);
        const received_info = await getUsersByIdService(data?.user_id);
        io.to(received_user?.data.socket_id).emit(
          "addFriend_notification",
          received_info.data
        );
      }
    });

    socket.on("friend_response", async (data) => {
      const addFriends = await agreeAddFriend(
        data.user_id,
        data.friend_id,
        data.action
      );
      if (addFriends.status === 200) {
        const notification = new NotificationService();
        await notification
          .update(data?.noti_id)
          .then(async () => {
            const received_user = await socketIO.searchOne(data?.friend_id);
            const senderInfo = await getUsersByIdService(data.user_id);
            const receiverInfo = await getUsersByIdService(data?.friend_id);
            if (+data.action === 1) {
              io.to(socket.id).emit("friend_res_noti", receiverInfo.data);
              io.to(received_user?.data.socket_id).emit(
                "resFriend_notification",
                senderInfo.data
              );
            }
            if (+data.action !== 0) return;
          })
          .catch((err) => {
            console.log(err.message);
            return;
          });
      }
    });

    socket.on("invite_meeting", async (data) => {
      
    })

    socket.on("user_disconnected", async (data) => {
      const id = data.user_id;
      socket.broadcast.emit("offline", id);
      const disconnectIo = new Socket(id, socket.id, 0);
      disconnectIo.update();
    });
  } catch (error) {
    return handleError(error);
  }
});

app.use("/auth", AuthRoute);
app.use("/api", Authentication, UserRoute);
app.use("/api", Authentication, SocketRoute);
app.use("/api", Authentication, MessageRoute);
app.use("/api", Authentication, NotificationRoute);
app.use("/api", Authentication, RoomRoute);
app.use("/api", Authentication, ScheduleRoute);
app.use("/api", Authentication, FriendRoute);
app.use("/api", Authentication, UserJoinRoute);
app.use("/api", Authentication, RoomMessageRoute);
app.use("/api", Authentication, UserInvitationRoute);
app.use((req, res) => {
  res.status(404).json({ status: 404, message: "404 NOT FOUND" });
});

server
  .listen(port, () => {
    console.log(
      `[Đồ án tốt nghiệp] is running on port ${port}, domain: http://localhost:${port}`
    );
  })

