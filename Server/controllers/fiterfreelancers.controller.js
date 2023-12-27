import { Freelancer } from "../models/freelancer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getFilterFreelancers = asyncHandler(async (req, res, next) => {
  const { jobprofile, paygrade } = req.body;
  if (!jobprofile || !paygrade) throw new ApiError(500, "Need all the fields");

  console.table([jobprofile, paygrade]);

  const pay = paygrade.replace("<= ", "");
    let freelancersArray = [];
  let freelancers;

  if (pay == "A") {
    freelancers = await Freelancer.find({
      $and: [
        {
          paygrade: {
            $in: ["A", "B", "C", "D"],
          },
        },
        {
          jobprofile: jobprofile,
        },
      ],
    });
  }
  if (pay == "B") {
    freelancers = await Freelancer.find({
      $and: [
        {
          paygrade: {
            $in: ["B", "C", "D"],
          },
        },
        {
          jobprofile: jobprofile,
        },
      ],
    });
  }
  if (pay == "C") {
    freelancers = await Freelancer.find({
      $and: [
        {
          paygrade: {
            $in: ["C", "D"],
          },
        },
        {
          jobprofile: jobprofile,
        },
      ],
    });
  }
  if (pay == "D") {
    freelancers = await Freelancer.find({
      $and: [
        {
          paygrade: {
            $in: ["D"],
          },
        },
        {
          jobprofile: jobprofile,
        },
      ],
    });
  }
  if (!freelancers) throw new ApiError(500, "Can not get freelancers.");
  for( let i =0 ; i < freelancers.length ; i++){
    const user = await User.findOne({
        email: freelancers[i].email
    })
    freelancersArray.push(user);
  }

  res.status(200).json(new ApiResponse(200,freelancersArray,"Freelancers fitered successfully"));
});

export { getFilterFreelancers };
