import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};
const LogoutUser = async (req, res, next) => {
  const user_id = req._id;
  const user = await User.findByIdAndUpdate(
    user_id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );
  res
    .status(200)
    .cookie("accessToken", null, cookieOptions)
    .cookie("refreshToken", null, cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
};

export { LogoutUser };
