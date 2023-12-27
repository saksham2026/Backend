import { Jobs } from "../models/jobs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getJobDetails = asyncHandler( async (req, res, next)=>{
    const { jobId } = req.body;
    if(!jobId) throw new ApiError(500, "can not get JobId");
    const Job = await Jobs.findById(jobId);
    const email = Job?.email; 
    const jobHoster = await User.findOne({email}).select("-_id -_refreshToken -_password -_updatedAt");
    if(!jobHoster) throw new ApiError(400, "Job Hoster not found");

    if(!Job) throw new ApiError(510, "Job not found");
    res.status(200).json(new ApiResponse(200,[Job, jobHoster],"Job fetched Successfully"));
})

export { getJobDetails };