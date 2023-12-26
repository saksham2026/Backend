import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessandRefreshTokens } from "../controllers/user.login.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

// This is the authorisation controller. All the secured routes are backed by this middleware.

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

// Before we move on, let me tell you the diffrence between accessToken and refreshToken
// accessToken are like a direct ticket to the server. If you have accessToken, you will
// be able to enter the secured route. Generally, accessTokens are short lived. Incase your
// accessToken is expired, we have refreshToken for you. It acts like refill for the accessToken
// It is long-lived compared to accessToken. If you have refreshToken, we will refill your
// accessToken, and you will be ready to go. This concept was introduced in order to
// reduce login attempts from the user, making their lives easy.

const jwtAuth = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies?.accessToken || req.header('Authorisation')?.replace("Bearer ","");
  const refreshToken = req.cookies?.refreshToken;
  if (!accessToken) {
    if (!refreshToken) {
      // Case1 where the user don't have either of both tokens. We will want him to login again.
      throw new ApiError(401, "User is not verified. Login Again");
    }
    // Here user have the refreshToken only
    // Checking whether the refreshToken is verified and has not expired. In any of these cases error will be thrown by jwt. We will put it in a try-catch block.

    try {
      const payloadData = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      // In case the user is verified
      const user_id = payloadData._id;
      const verifiedUser = await User.findById(user_id).select("-password");
      // Checking if the user exists.
      if (!verifiedUser) throw new ApiError(401, "Invalid token. Login again");
      // Validating the refreshToken
      if (!(refreshToken === verifiedUser.refreshToken))
        res
          .status(400)
          .json({
            message: "User not verified. Login Again",
          })
          .cookie("accessToken", null, cookieOptions)
          .cookie("refreshToke", null, cookieOptions);
      // At this place user has a valid and verified refreshToken. Now we will renew both his refreshToken and accessToken.

      const { refreshToken, accessToken } =
        await generateAccessandRefreshTokens(user_id);
      req._id = user_id;
      next();
    } catch (error) {
      // As the error is thrown, we will want user to login again.
      throw new ApiError(401, "User not verified. Login again");
    }
  }

  // till now we have successfully handled the case, where user does not have accessToken,
  // but has a valid or invalid refreshToken

  // Now we will handle the case, in which user has accessToken

  try {
    const payloadData = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_KEY
    );
    // If user has a valid accessToken, we will check it's existence in the database.
    const ifUserExists = await User.findById(payloadData._id);
    // If no user exists, this is the indication of some, security issue. We will not check for the refresh token.
    if (!ifUserExists) {
      return res
        .status(400)
        .json({
          message: "User not verified. Login again",
        })
        .cookie("accessToken", null, cookieOptions)
        .cookie("accessToken", null, cookieOptions);
    }
    // If the user exists, renew his refresh and access tokens.

    await generateAccessandRefreshTokens(payloadData._id);
    req._id = payloadData._id;
    next();
  } catch (error) {
    // In case of error, we will check for refreshToken.
    if (!refreshToken)
      throw new ApiError(403, "User is not verified. Login again");
    // After this we will copy paste the code from above from line 34 to line 62.
    try {
      const payloadData = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      // In case the user is verified
      const user_id = payloadData._id;
      const verifiedUser = await User.findById(user_id).select("-password");
      // Checking if the user exists.
      if (!verifiedUser) throw new ApiError(401, "Invalid token. Login again");
      // Validating the refreshToken
      if (!(refreshToken === verifiedUser.refreshToken))
        res
          .status(400)
          .json({
            message: "User not verified. Login Again",
          })
          .cookie("accessToken", null, cookieOptions)
          .cookie("refreshToke", null, cookieOptions);
      // At this place user has a valid and verified refreshToken. Now we will renew both his refreshToken and accessToken.

      const { refreshToken, accessToken } =
        await generateAccessandRefreshTokens(user_id);
      req._id = user_id;
      next();
    } catch (error) {
      // As the error is thrown, we will want user to login again.
      throw new ApiError(401, "User not verified. Login again");
    }
  }
});

export { jwtAuth };
