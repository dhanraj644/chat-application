import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const chat = sequelize.define("chat", {
  content: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  from: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  to: {
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
  }
});

export default chat;
