import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Producer } from "../models/producer.model.js";
import { Freelancer } from "../models/freelancer.model.js";
import fs from "fs";
const Register = asyncHandler(async (req, res, next) => {
  let avatarFilePath = null;
  console.log("Saksham Aggarwal");
  const { email, firstname, lastname, password, role, username, mobile } =
    req.body;
  if (!email || !password || !firstname || !role || !username || !mobile) {
    throw new ApiError(400, "All the feilds are required");
  }
  const user1 = await User.find({ email });
  const user2 = await User.find({ username });
  const user3 = await User.find({ mobile });
  console.log("user1", user1);
  console.log("user2", user2);
  console.log("user3", user3);


  if (user1[0]?._id != undefined) {
    console.log(user1._id);
    throw new ApiError(409, "User with given email exists");
  }
  if (user2[0]?._id != undefined) {
    throw new ApiError(410, "User with given username exists");
  }
  if (user3[0]?._id != undefined) {
    throw new ApiError(411, "User with given mobile Exists");
  }
  
    avatarFilePath = req.files?.avatar[0]?.path;
    console.log("Hello", avatarFilePath);
  if (user1._id || user2._id) {
    fs.unlinkSync(avatarFilePath);
    throw new ApiError(401, "User already exists");
  }

  if (!avatarFilePath) {
    await User.create({
      firstname,
      lastname,
      email,
      password,
      role,
      username,
      mobile,
      avatarUrl:
        "https://res.cloudinary.com/dl9f2vrhu/image/upload/v1703436685/k8862xu21guu8p9ga6mb.png",
      public_id: "k8862xu21guu8p9ga6mb",
    });
  } else {
    const avatarUrl = await uploadOnCloudinary(avatarFilePath);

    if (!avatarUrl) throw new ApiError(500, "Failed to upload on Cloudinary");
    await User.create({
      firstname,
      lastname,
      email,
      password,
      role,
      username,
      mobile,
      avatarUrl: avatarUrl.url,
      public_id: avatarUrl.public_id,
    });
  }

  if (role == "Producer") {
    await Producer.create({
      email,
    });
  } else {
    await Freelancer.create({
      email,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User registered successfully"));
});

export { Register };
