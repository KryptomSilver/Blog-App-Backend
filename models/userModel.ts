import mongoose from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your name"],
      trim: true,
      maxlength: [20, "Your name is up to 20 chars long."],
    },
    account: {
      type: String,
      required: [true, "Pleace add your email or phone"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add your password"],
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://electronicssoftware.net/wp-content/uploads/user.png",
    },
    role: {
      type: String,
      default: "user",
    },
    type: {
      type: String,
      default: "register",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
