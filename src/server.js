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
const UserJoinRoute = require("./Routes/User_Join.api");
const RoomMessageRoute = require("./Routes/Room_Message.api");
const UserInvitationRoute = require("./Routes/User_Invitation.api");
const db_connect = require("./Database/db.connect");
const cors_config = require("./Middlewares/CORS");
const { createServer } = require("node:http");
const initializeSocket = require("./socketServer");
require("dotenv").config();
const server = createServer(app);

const io = initializeSocket(server);

app.use(cors_config);
app.use(db_connect);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;



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

server.listen(port, () => {
  console.log(
    `[Đồ án tốt nghiệp] is running on port ${port}, domain: http://localhost:${port}`
  );
});
