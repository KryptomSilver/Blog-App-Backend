import mongoose from "mongoose";
import { IComment } from "../interfaces";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    blog_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    blog_user_id: {
      type: mongoose.Types.ObjectId,
    },
    content: {
      type: String,
      required: true,
    },
    replyCM: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    replyUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IComment>("Comment", commentSchema);
