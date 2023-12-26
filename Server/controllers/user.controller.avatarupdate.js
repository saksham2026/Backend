import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
const updateAvatar = asyncHandler(async (req, res, next) => {
  const user_id = req._id;
  const user = await User.findById(user_id);
  if (!user) throw new ApiError(403, "Can not find User");
  const localfilepath = req.files?.avatar[0]?.path;
  if (!localfilepath) throw new ApiError(500, "Can not get Local file Path");
  if (user.public_id != "k8862xu21guu8p9ga6mb") {
    deleteOnCloudinary(user.public_id)
      .then(async () => {
        const response = await uploadOnCloudinary(localfilepath);
        if (!response.url) {
          fs.unlinkSync(localfilepath);
          throw new ApiError(500, "Can not upload on Cloudinary.");
        }
        fs.unlinkSync(localfilepath);
        await User.findByIdAndUpdate(user_id, {
          $set: {
            avatarUrl: response.url,
            public_id: response.public_id,
          },
        });
        res
          .status(200)
          .json(
            new ApiResponse(
              200,
              response.url,
              "Profile Image Uploaded Successfully"
            )
          );
      })
      .catch((err) => {
        fs.unlinkSync(localfilepath);
        throw new ApiError(500, err);
      });
  } else {
    if (!localfilepath) throw new ApiError(500, "No localfile path");
    const response = await uploadOnCloudinary(localfilepath);
    if (!response.url) {
      fs.unlinkSync(localfilepath);
      throw new ApiError(500, "Can not upload on Cloudinary.");
    }
    fs.unlinkSync(localfilepath);
    await User.findByIdAndUpdate(user_id, {
      $set: {
        avatarUrl: response.url,
        public_id: response.public_id,
      },
    });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          response.url,
          "Profile Image Uploaded Successfully"
        )
      );
  }
});

export { updateAvatar };
