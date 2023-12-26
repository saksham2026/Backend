import { Jobs } from "../models/jobs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const deleteJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.body;
  if (!jobId) throw new ApiError(500, "Job not found");

  await Jobs.deleteOne({ _id: jobId });
  res.status(200).json(new ApiResponse(200, {}, "Job deleted successfully"));
});

export { deleteJob };
