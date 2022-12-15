import User from "../models/user.schema";
import CustomError from "../utils/customError";
import { asyncHandler } from "../services/asyncHandler";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};
/************************************************************
 *  @SIGNUP
 *  @route http://localhost:5000/api/auth/signup
 *  @description User signup Controller for creating new user
 *  @parameters name, email ,password
 *  @returns User object
 ***********************************************************/

export const signUp = asyncHandler(async (req, res) => {
  // extract data from req bodys

  const { name, email, password } = req.body;

  // validate fields

  if (!(name, email, password)) {
    throw new CustomError("Fields kaha hai", 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new CustomError("Email already registered", 400);
  }

  const user = await User.create({
    name,
    email,

    password, // yaha password encrypt nhi kia gaya because password is already enc in model
  });
  const token = user.getJWT(); //here we write user.method name not User.methodname beacuse the methods present in models files are attached and available to the userSchema not the model we export . so when we create an object the methods are now available to them.

  res.cookie("token", token, cookieOptions);
  user.password = undefined;
  res.status(201).json({
    success: true,
    message: "User created",
    token,
    user,
  });
});
