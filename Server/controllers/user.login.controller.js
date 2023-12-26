import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

async function generateAccessandRefreshTokens(user_id) {
  const user = await User.findById(user_id);
  const accessToken = await user.generatAccessToken();
  const refreshToken = await user.generatRefreshToken();
  await User.findByIdAndUpdate(
    user_id,
    {
      $set: {
        refreshToken: refreshToken,
      },
    },
    {
      new: true,
    }
  );

  return { accessToken, refreshToken };
}

const cookieOptions = {
  httpOnly: true,
  secure: true,
  SameSite: 'none',
};

const LoginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  console.log(username);
  if (!username || !password)
    throw new ApiError(403, "Email and Password both are required");

  const findUser = await User.findOne({ username });
  if (!findUser) throw new ApiError(405, "User does not exists");
  const isPasswordCorrect = await findUser.isPasswordCorrect(password);
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect) throw new ApiError(402, "Enter Correct Password");
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    findUser._id
  );
  findUser.refreshToken = "";
  (findUser.password = ""),
    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, findUser, "User logged in Successfully"))
});

export { LoginUser , generateAccessandRefreshTokens };
