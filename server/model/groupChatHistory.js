import mongoose from "mongoose";

const groupchatSchema = new mongoose.Schema({
  msg: {
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
  },
  groupid: {
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

const groupchat = mongoose.model("groupchat", groupchatSchema);
export default groupchat;
