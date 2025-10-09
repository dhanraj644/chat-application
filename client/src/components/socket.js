import { io } from "socket.io-client";

const socket = io(`https://chat-application-l275.onrender.com`, {
  autoConnect: false,
});

export default socket;
