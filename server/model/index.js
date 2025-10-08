import user from "./userModel.js";
import room from "./roomModel.js";
import sequelize from "../config/db.js";
import chat from "../model/chatHistory.js";
import groupchat from "../model/groupChatHistory.js";

user.hasMany(room);
room.belongsTo(user);

sequelize.sync();

export { room, user, chat, groupchat };
