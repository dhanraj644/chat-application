import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomid: {
    type: String,
    default: "",
  },
  roomName: {
    type: String,
    default: "",
  },
  roomMember: {
    type: [String],
    default: [],
  },
  userId: {
    type: String,
    default: "",
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const room = mongoose.model("room", roomSchema);
export default room;
