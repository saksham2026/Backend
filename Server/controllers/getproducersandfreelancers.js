import { User } from "../models/user.model.js";
import { Freelancer } from "../models/freelancer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getProducersAndFreelancers = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req._id);
  const email = user.email;
  const freelancers = await User.find({
    $and: [
      {
        role: "Freelancer",
      },
      {
        email: {
          $ne: email,
        },
      },
    ],
  }).select("firstname lastname username avatarUrl");
  const producers = await User.find({
    $and: [
      {
        role: "Producer",
      },
      {
        email: {
          $ne: email,
        },
      },
    ],
  }).select("firstname lastname username avatarUrl");
  console.log(producers);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { producers, freelancers },
        "fetched freelancers succesfully"
      )
    );
});

export { getProducersAndFreelancers };
