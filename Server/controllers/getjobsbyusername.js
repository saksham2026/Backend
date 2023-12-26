import { Jobs } from "../models/jobs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
const getJobsByUsername = asyncHandler(async (req, res, next) => {
  const { username } = req.body; // This endpoint will recieve the username of the job Poster.

  if (!username) throw new ApiError(500, "Didn't recieved username");

  const jobProvider = await User.findOne({ username }); // This is database call for fetching the details of Job Poster.

  if (!jobProvider) throw new ApiError(500, "Can not find Job Provider.");

  const emailOfJobProvider = jobProvider.email; // Storing the email of jobProvider

  if (!emailOfJobProvider)
    throw new ApiError(500, "Can not find email of Job Provider");

  const jobs = await Jobs.find({ email: emailOfJobProvider });

  if (!jobs) throw new ApiError(500, "Can not find Jobs");

  // If everything above was successfull, we are good to go.

  res.status(200).json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});

export { getJobsByUsername };
