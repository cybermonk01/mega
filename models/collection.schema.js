import mongoose from "mongoose";

const collectionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " name is required"],
      trim: true,
      maxLength: [25, "not more than 25 characters"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Collection", collectionSchema);
