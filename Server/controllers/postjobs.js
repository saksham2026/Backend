import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Jobs } from "../models/jobs.model.js";
import { Producer } from "../models/producer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const postJob = asyncHandler(async (req, res, next) => {
  const { paygrade, location, time, title, jobdescription } = req.body;
  if (!paygrade || !location || !time || !title || !jobdescription)
    throw new ApiError(500, "Can not get all details");
  const email = await User.findById(req._id).select("email -_id");
  if(!email) throw new ApiError(500,"User not found");
  const postedJob = await Jobs.create({
    email : email.email,
    jobDescription: jobdescription,
    location,
    paygrade,
    time,
    jobprofile: title,
  });
  res.status(200).json( new ApiResponse(200, postedJob, "Job posted successfully"));
});

export { postJob };
