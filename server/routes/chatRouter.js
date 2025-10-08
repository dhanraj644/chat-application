import { getAllChat, getAllChatGroup } from "../controller/chatController.js";
import express from "express";

const chatRouter = express.Router();

chatRouter.get("/get", getAllChat);
chatRouter.get("/groupchat", getAllChatGroup);

export default chatRouter;
