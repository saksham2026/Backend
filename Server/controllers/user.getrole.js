import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getRole = asyncHandler( async (req, res, next)=>{
    // this is a very basic controller for providing the Profession["Freelancer", "Producer"] of the apicaller.
    // This is a secured controller.

    const user_id = req._id;
    const user = await User.findById(user_id).select("role -_id");
    if(!user) throw new ApiError(500, "User does not exists.");

    res.status(200).json(new ApiResponse(200, user,"Role fetched successfully"));
});

export { getRole };