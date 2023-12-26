import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";
const jobSchema = new Schema(
  {
    email: {
      type: String,
      ref: User,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    paygrade: {
      type: String,
      required: true,
    },
    location: {
        type: String,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    jobprofile:{
      type: String,
      enum: ["A", "B", "C", "D"]
    }
  },
  { timestamps: true }
);

export const Jobs = mongoose.model('Jobs', jobSchema);