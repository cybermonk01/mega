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

/************************************************************
 *  @SIGNIN
 *  @route http://localhost:5000/api/auth/signin
 *  @description User signin Controller for loging in user
 *  @parameters email ,password
 *  @returns User object
 ***********************************************************/

export const signIn = asyncHandler(async (req, res) => {
  // extract data

  const { email, password } = req.body;
  // validate data

  if (!(email, password)) {
    throw new CustomError("Fields are mandatory", 400);
  }

  //check for user in db

  const existingUser = User.findOne({ email }).select("+password"); // here we explicitly send password using select chaining as password will not be present as select is false;

  if (existingUser) {
    const isPasswordMatched = await user.comparePassword(password);

    if (isPasswordMatched) {
      const token = user.getJWT();
      user.password = undefined;
      res.cookie("token", token, cookieOptions);
      return res.status(201).json({
        message: "user logged in",
        success: true,
        user,
        token,
      });
    }

    throw new CustomError("password not matched", 400);
  }

  throw new CustomError("Email not exists", 400);
});

/************************************************************
 *  @Logout
 *  @route http://localhost:5000/api/auth/signout
 *  @description User sign out Controller by clearing cookie
 *  @parameters
 *  @returns success message
 ***********************************************************/

export const signOut = asyncHandler(async (_req, res) => {
  //here _req is written because we are not using req here

  // res.clearCookie()    this can also be used
  res.cookie("token", null, {
    expiresIn: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "logged out",
    success: true,
    user,
    token,
  });
});
