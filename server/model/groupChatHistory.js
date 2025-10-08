import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const groupchat = sequelize.define("groupchat", {
  msg: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  name: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  date: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  groupid: {
    type: DataTypes.STRING,
    defaultValue: false,
  }
});

export default groupchat;
