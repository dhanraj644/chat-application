import { chat, groupchat } from "../model/index.js";

const getAllChat = async (req, res) => {
  try {
    const data = await chat.findAll();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllChatGroup = async (req, res) => {
  try {
    const data = await groupchat.findAll();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export { getAllChat, getAllChatGroup };
