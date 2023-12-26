import { Freelancer } from "../models/freelancer.model.js";
import { Producer } from "../models/producer.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserWithUsername = asyncHandler(async (req, res, next) => {
  const { username } = req.body;
  if (!username) throw new ApiError(500, " Can not get username ");
  const personalDetails = await User.find({ username }).select("-password -refreshToken -createdAt -updatedAt -public_id -_id -username -__v");
  if (!personalDetails) throw new ApiError(413, "Freelancer does not exists");
  console.log("Personal Details", personalDetails);
  const email = personalDetails[0]?.email;
  let professionalDetails;
  if(personalDetails[0].role =="Freelancer"){
      professionalDetails = await Freelancer.find({ email }).select("-email -_id");
  }
  else{
    professionalDetails = await Producer.find({ email }).select("-email -_id");
  }
  if (!professionalDetails)
    throw new ApiError(414, "Can not get personal details of freelancer.");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { personalDetails, professionalDetails },
        "Details fetched successfully"
      )
    );
});

export { getUserWithUsername };
