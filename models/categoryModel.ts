import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your category"],
      trim: true,
      maxlength: [50, "Name is up to 50 chars long."],
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);