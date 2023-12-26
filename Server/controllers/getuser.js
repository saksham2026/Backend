import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Freelancer } from "../models/freelancer.model.js";
import { Producer } from "../models/producer.model.js";
const getUser = asyncHandler(async (req, res, next) => {
  const user_id = req._id;
  const user = await User.findById(user_id);
  if (!user) throw new ApiError(400, "User does not exists");
  const email = user.email;
  user.password = null;
  user.refreshToken = null;
  user.public_id = null;
  if (user.role == "Producer") {
    const P = await Producer.find({ email });
    if (!P) throw new ApiError(200, "Can not Find Producer");
    const about = P;
    res
      .status(200)
      .json(new ApiResponse(200, { user, about }, "fetching data successfull"));
  } else {
    try {
      const F = await Freelancer.find({ email });
      if (!F) throw new ApiError(200, "Can not Find Freelancer");
      const about = F;
      res
        .status(200)
        .json(
          new ApiResponse(200, { user, about }, "fetching data successfull")
        );
    } catch (error) {
      console.log("hello", error);
    }
  }
});

export { getUser };
``;
