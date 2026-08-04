import { io } from "socket.io-client";
import api from "./api"
const socket = io(`${api}`, {
  autoConnect: false,
});

export default socket;
