import User from "../models/user.schema";
import CustomError from "../utils/customError";
import { asyncHandler } from "../services/asyncHandler";
import crypto from "crypto";
import mailHelper from "../utils/mailHelper";

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

/************************************************************
 *  @ForgotPassword
 *  @route http://localhost:5000/api/auth/password/forgot
 *  @description User send email and we send token to reset pwd
 *  @parameters email
 *  @returns success message- pwd reset send
 ***********************************************************/

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("User is not registered", 404);
  }

  const resetToken = user.generatePasswordToken();

  await User.bulkSave({ validateBeforeSave: false });

  //reset url can be wriiten as 'http://localhost:/.../../auth/..
  const resetUrl = `
  ${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`;

  const text = `your password reset url is \n\n ${resetUrl}\n\n`;
  try {
    await mailHelper({
      email: user.email,
      subject: "Password reset email for website",
      text: text,
    });
    res.status(200).json({
      success: true,
      message: `email send to ${user.email}`,
    });
  } catch (err) {
    //roll back- clear fields and save

    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    throw new CustomError(err.message || " Email sent failure", 500);
  }
});

/************************************************************
 *  @ForgotPassword
 *  @route http://localhost:5000/api/auth/password/reset/:resetToken
 *  @description reset the pwd based on reset token
 *  @parameters token from url , pwd and confirmpwd
 *  @returns  user Object
 ***********************************************************/

export const resetPassword = asyncHandler(async (req, res) => {
  // extract token from params

  const { token: resetToken } = req.params;
  // get pwd and confirmpwd from req body
  const { password, confirmPassword } = req.body;

  //create a hash for reset token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // find a user based on reset token and should be greater than expiry date

  const user = User.findOne({
    forgotPasswordToken: resetPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  // if user not present throw error

  if (!user) {
    throw new CustomError("User not found !", 400);
  }
  //  if pwd and confirm pwd does not match throw error
  if (password !== confirmPassword) {
    throw new CustomError("password should match", 400);
  }
  // store password in user.password

  user.password = password;
  // make undefined unused fields such as forgot token and expiry
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  //save user

  await user.save();
  //create a token and send as response
  const token = user.getJWT();

  // make a cookie and send it

  res.cookie("token", token, cookieOptions);
  user.password = undefined;

  //send res.json
  res.status(200).json({
    success: true,
    user,
    token,
  });
});

/************************************************************
 *  @GETUserProfile
 *  @route http://localhost:5000/api/auth/profile
 *  @description check for token and populate the user
 *  @parameters
 *  @returns  user profile
 ***********************************************************/

export const getUserProfile = asyncHandler(async (req, res) => {
  const { user } = req;

  if (!user) {
    throw new CustomError("User does not exists", 404);
  }

  res.status(200).json({
    success: true,
    message: "Have this profile",
    user,
  });
});
