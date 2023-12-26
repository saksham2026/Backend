import { Jobs } from "../models/jobs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getAllJobs = asyncHandler( async (req, res, next)=>{
    // This is controller for fetching all available jobs. We do not require any verification and data here. All has been done
    // by our helpfull middleware. I don't know how much I rely on it.

    const jobs = await Jobs.find(); // This will get us all the available jobs.

    if(!jobs) throw new ApiError(500, "Can not fetch jobs");

    res.status(200).json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});

export { getAllJobs };