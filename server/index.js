import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import { chat, groupchat, user } from "./model/index.js";
import chatRouter from "./routes/chatRouter.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);

const allowedOrigins = [
  "https://chat-application-lake-pi.vercel.app/"
    credentials: true
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  }
});

app.use(
  cors({
    origin: allowedOrigins, 
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);

// Connect to MongoDB
connectDB();

// API calls
app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/user", userRouter);
app.use("/chat", chatRouter);

// Socket.io
var users = {};

io.on("connection", (socket) => {
  // Triggered when client logs in and joins the socket
  socket.on("connected", async (userId) => {
    if (!userId) return;
    console.log("User is connected (socket.id):", socket.id, "userId:", userId);
    users[userId] = socket.id;
    console.log("Online users mapping:", users);
    
    try {
      await user.findByIdAndUpdate(userId, { status: "true" });
      io.emit("statusChange", { id: userId, status: "true" });
    } catch (error) {
      console.error("Error updating user status on connection:", error);
    }
  });

  socket.on("private message", async (data) => {
    console.log("Private message data:", data);
    try {
      // Create chat history entry in MongoDB
      const newChat = await chat.create({
        content: data.content,
        from: data.from,
        to: data.to,
        name: data.name,
        date: data.date
      });

      const recipientSocketId = users[data.to];
      const senderSocketId = users[data.from];

      // Convert mongoose object to plane JS object to make sure virtuals/id are serialized properly
      const serializedData = newChat.toJSON();

      if (recipientSocketId) {
        io.to(recipientSocketId).to(senderSocketId).emit("private message", serializedData);
      } else {
        if (senderSocketId) {
          io.to(senderSocketId).emit("private message", serializedData);
        }
        console.log("Recipient is offline, saved message in DB");
      }
    } catch (error) {
      console.error("Error saving private message:", error);
    }
  });

  socket.on("join", (roomid) => {
    console.log(`Socket ${socket.id} joined room: ${roomid}`);
    socket.join(roomid);
  });

  socket.on("groupchat", async (roomid, data) => {
    console.log("Group chat data:", data);
    try {
      const newGroupChat = await groupchat.create({
        msg: data.msg,
        name: data.name,
        date: data.date,
        groupid: data.groupid
      });
      
      const serializedData = newGroupChat.toJSON();
      io.to(roomid).emit("groupchat", serializedData);
    } catch (error) {
      console.error("Error saving group chat message:", error);
    }
  });

  socket.on("typing", (data) => {
    if (data.to) {
      const recipientSocketId = users[data.to];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("typing", data);
      }
    } else if (data.roomid) {
      socket.to(data.roomid).emit("typing", data);
    }
  });

  socket.on("logout", async (id) => {
    if (!id) return;
    console.log("User logout requested:", id);
    delete users[id];
    try {
      await user.findByIdAndUpdate(id, { status: "false" });
      io.emit("statusChange", { id: id, status: "false" });
    } catch (error) {
      console.error("Error setting status false on logout:", error);
    }
  });

  socket.on("disconnect", async () => {
    console.log("Socket disconnected:", socket.id);
    const userId = Object.keys(users).find((key) => users[key] === socket.id);
    if (userId) {
      delete users[userId];
      console.log(`Disconnected user: ${userId}. Remaining online users:`, users);
      try {
        await user.findByIdAndUpdate(userId, { status: "false" });
        io.emit("statusChange", { id: userId, status: "false" });
      } catch (error) {
        console.error("Error setting status false on disconnect:", error);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
