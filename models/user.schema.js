import mongoose from "mongoose";
import { authRoles } from "../utils/adminRoles";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [25, "Length should not be more than 25"],
    },
    email: {
      type: String,
      required: [true, "Sahi email daalo"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password to daalo"],
      minLength: [4, "4 Charcter to daalo"],
      select: false,
    },
    roles: {
      type: String,
      enum: Object.values(authRoles),
    },

    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
