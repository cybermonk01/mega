import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
  {
    couponId: {
      type: String,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    valid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Coupon", couponSchema);
