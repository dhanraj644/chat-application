import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    default: "",
  },
  userEmail: {
    type: String,
    default: "",
    unique: true,
  },
  userPassword: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["true", "false"],
    default: "false",
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

const user = mongoose.model("user", userSchema);
export default user;
