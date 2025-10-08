import express from "express";
import {
  userCreate,
  userLogin,
  getAllUser,
  statusupdate,
} from "../controller/userController.js";
import { createRoom, getRoom } from "../controller/roomController.js";
const userRouter = express.Router();

userRouter.post("/create", userCreate);

userRouter.post("/createroom", createRoom);

userRouter.post("/login", userLogin);

userRouter.get("/getUser", getAllUser);

userRouter.get("/getroom", getRoom);

userRouter.put("/statusUpdate/:id", statusupdate);

export default userRouter;
