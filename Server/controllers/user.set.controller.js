import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Producer } from "../models/producer.model.js";
import { Freelancer } from "../models/freelancer.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const setUser = asyncHandler(async (req, res, next) => {
  console.log("MIA");
  const user_id = req._id;
  if (!user_id) throw new ApiError(400, "user_id not found");
  const user = await User.findById(user_id);
  if (!user) throw new ApiError(400, "No user exists");
  const {
    firstname,
    lastname,
    email,
    role,
    aboutme,
    experience,
    pay,
    awards,
    username,
    mobile,
    jobprofile
  } = req.body;
  console.log("Body", req.body);
  await User.findByIdAndUpdate(req._id, {
    $set: {
      firstname,
      lastname,
      email,
    },
  });
  if (role == "Producer") {
    const newProducer = await Producer.updateOne(
      { email },
      {
        $set: {
          about: aboutme,
          experience,
          honors: awards,
        },
      },
      {
        new: true,
      }
    );

  } else {
    await Freelancer.updateOne(
      { email },
      {
        $set: {
          about: aboutme,
          experience,
          paygrade: pay,
          jobprofile
        },
      }
    );
  }
  res.status(200).json(new ApiResponse(200, {}, "User updated Successfully"));
});

export { setUser };
