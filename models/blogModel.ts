import mongoose, { mongo } from "mongoose";
import { IBlog } from "../interfaces";
const blogSchema = new mongoose.Schema(
  {
    user: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 50,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 2000,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 200,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", blogSchema);
