import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import { chat, groupchat } from "./model/index.js";
import chatRouter from "./routes/chatRouter.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(express.urlencoded());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "chat-application-cgn6.vercel.app",
  },
  connectionStateRecovery: {},
});

app.use(
  cors({
    origin: "chat-application-cgn6.vercel.app",
  })
);

// api calls

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/user", userRouter);
app.use("/chat", chatRouter);

// socket .io

var users = {};

io.on("connection", (socket) => {
  socket.on("connected", (userId) => {
    console.log("user is connected !!!!!!!!!!", userId);
    users[userId] = socket.id;
  });

  console.log("new id :" + socket.id);
  console.log("user maping : ", users);

  socket.on("private message", async (data) => {
    console.log(data);
    //  users[from] = socket.id;
    try {
      await chat.create(data);
      const id = users[data.to];
      if (id) {
        io.to(id).to(users[data.from]).emit("private message", data);
      } else {
        io.to(users[data.from]).emit("private message", data);
        console.log("user is not found");
      }
    } catch (error) {
      console.log("something wrong", error);
    }
  });

  socket.on("join", (roomid) => {
    console.log("group is joind", roomid);
    socket.join(roomid);
  });

  socket.on("groupchat", async (roomid, data) => {
    console.log(data);
    io.to(roomid).emit("groupchat", data);
    await groupchat.create(data);
  });

  socket.on("logout", (id) => {
    // console.log(id,users)
    delete users[id];
    // console.log('User logout', users);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log("server is runing on 5001");
});
