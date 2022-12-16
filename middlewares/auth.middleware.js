import crypto from "crypto";
import config from "../config/index";
import mailHelper from "../utils/mailHelper";
import userSchema from "../models/user.schema";
import { asyncHandler } from "../services/asyncHandler";
import CustomError from "../utils/customError";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[1]; //here token is extracted from Bearer token or cookie token
  }

  if (!token) {
    throw new CustomError("Not authorized to access this route", 401);
  }

  try {
    const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET);
    // _id, find user based on id, set this in req.user

    req.user = await User.findById(decodedJwtPayload._id, "name email role");

    next();
  } catch (err) {
    throw new CustomError("Not authorized to access this route", 401);
  }
});
