import { asyncHandler } from "../utils/asyncHandler.js";
import { Jobs } from "../models/jobs.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getFilteredJobs = asyncHandler(async (req, res, next) => {
  const { jobprofile, paygrade, duration } = req.body;
  const d = +duration;
  if (!jobprofile || !paygrade || !duration)
    throw new ApiError(500, "I need all values");
  console.log("Hello");
  console.table([jobprofile, paygrade, +duration]);

  const paygrageFilter = paygrade.replace(">= ", "");
  let jobs = "Helllo";

  if (paygrageFilter == "A") {
    jobs = await Jobs.find({
      $and: [
        {
          paygrade: {
            $in: ["A"],
          },
        },
        {
          time: {
            $lte: d,
          },
        },
        { jobprofile: jobprofile },
      ],
    });
  }

  if (paygrageFilter == "B") {
    jobs = await Jobs.find({
      $and: [
        {
          paygrade: {
            $in: ["A", "B"],
          },
        },
        {
          time: {
            $lt: +duration,
          },
        },
        { jobprofile: jobprofile },
      ],
    });
  }
  if (paygrageFilter == "C") {
    jobs = await Jobs.find({
      $and: [
        {
          paygrade: {
            $in: ["A", "B", "C"],
          },
        },
        {
          time: {
            $lt: +duration,
          },
        },
        { jobprofile: jobprofile },
      ],
    });
  }
  if (paygrageFilter == "D") {
    jobs = await Jobs.find({
      $and: [
        {
          paygrade: {
            $in: ["A", "B", "C", "D"],
          },
        },
        {
          time: {
            $lt: +duration,
          },
        },
        { jobprofile: jobprofile },
      ],
    });
  }

  if (!jobs) throw new ApiError(500, "Jobs are null");
  res.status(200).json(new ApiResponse(200, jobs, "jobs fetched successfully"));
});

export { getFilteredJobs };
