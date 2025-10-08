import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const user = sequelize.define("user", {
  userName: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
  userPassword: {
    type: DataTypes.STRING,
    defaultValue: false,
  },

  status: {
    type: DataTypes.ENUM("true", "false"),
    defaultValue: "false",
  }
});

export default user;
