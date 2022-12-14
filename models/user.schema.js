import mongoose from "mongoose";
import { authRoles } from "../utils/adminRoles";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";

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
//  Pre is an mongoose hook used to do some stuffs before a  prescribed event.

userSchema.pre("save", async function (next) {
  if (!this.modified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// mongoose methods are used to add  more functionality to schema

userSchema.methods = {
  // compare passwords

  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  // create a JWT token and then send it through mongoose methods

  getJWT: function () {
    return JWT.sign(
      {
        _id: this._id,
        role: this.role,
      },
      "bad-secret",
      {
        expiresIn: "2h-bad",
      }
    );
  },

  generateForgotPasswordToken: function () {
    const forgotToken = crypto.randomBytes(20).toString("hex");

    // step 1
    // save the token to db

    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex"); //yaha pe possword jo hai wo jaake db me save ho jaa raha hai , yaha pe humne pehle to long string generate kia tha usko aur hash kar dia jisse save rahe

    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000; //this. jo hai ye expiry date set kar dega wo bhi db me

    return forgotToken;

    // step2- send the token to user (via. email or jisse bhi bhejna hai)
  },
};

export default mongoose.model("User", userSchema);
