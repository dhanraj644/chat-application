import { chat, groupchat } from "../model/index.js";

const getAllChat = async (req, res) => {
  try {
    const data = await chat.find({});

    res.status(200).json(data);
  } catch (error) {
    console.error("getAllChat error:", error);
    res.status(500).json({ error: error.message || error });
  }
};

const getAllChatGroup = async (req, res) => {
  try {
    const data = await groupchat.find({});

    res.status(200).json(data);
  } catch (error) {
    console.error("getAllChatGroup error:", error);
    res.status(500).json({ error: error.message || error });
  }
};

export { getAllChat, getAllChatGroup };
