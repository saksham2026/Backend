import { Jobs } from "../models/jobs.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getJobs = asyncHandler(async (req, res, next)=>{
    const user_id = req._id ;
    const email = await User.findById(user_id);
    console.log("Email",email)
    if(!email) throw new ApiError(500, "Email not found");
    const Job = await Jobs.find({email:email.email});
    if(Jobs == null) throw new ApiError(500, "Can not find Jobs");

    res.status(200).json(new ApiResponse(200,Job,"Jobs fetched successfully."));
});

export { getJobs };