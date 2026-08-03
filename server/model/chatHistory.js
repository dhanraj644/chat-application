import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  content: {
    type: String,
    default: "",
  },
  from: {
    type: String,
    default: "",
  },
  to: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  date: {
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

const chat = mongoose.model("chat", chatSchema);
export default chat;
