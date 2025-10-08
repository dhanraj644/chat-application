import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const room = sequelize.define("room", {
  roomid: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  roomName: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  roomMember: {
    type: DataTypes.JSON,
    defaultValue: false,
  }
});

export default room;
