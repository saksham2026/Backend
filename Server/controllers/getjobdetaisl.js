import { Jobs } from "../models/jobs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getJobDetails = asyncHandler( async (req, res, next)=>{
    const { jobId } = req.body;
    if(!jobId) throw new ApiError(500, "can not get JobId");
    const Job = await Jobs.findById(jobId);
    if(!Job) throw new ApiError(510, "Job not found");
    res.status(200).json(new ApiResponse(200,Job,"Job fetched Successfully"));
})

export { getJobDetails };