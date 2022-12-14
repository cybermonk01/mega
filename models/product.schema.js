import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " name is required"],
      trim: true,
      maxLength: [25, "not more than 25 characters"],
    },
    description: {
      type: String,
    },
    photos: [
      {
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },

    sold: {
      type: Number,
      default: 0,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
