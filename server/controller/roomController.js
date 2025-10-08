import { room } from "../model/index.js";

const createRoom = async (req, res) => {
  try {
    const { roomid, roomName, members, createdBy } = req.body;

    await room.create({
      roomid: roomid,
      roomName: roomName,
      roomMember: members,
      userId: createdBy,
    });

    res.status(200).json({ msg: "room is created" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getRoom = async (req, res) => {
  try {
    const data = await room.findAll();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export { createRoom, getRoom };
