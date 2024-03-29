import mongoose, { Schema } from "mongoose";

const freelancerSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    about: {
      type: String,
    },
    experience: {
      type: String,
    },
    paygrade: {
      type: String,
      enum: ["A", "B", "C", "D","None"]
    },
    jobprofile:{
      type:String,
      enum: ["A", "B", "C", "D","None"]
    }
  },
  { timestamps: true }
);

export const Freelancer = mongoose.model("Freelancer", freelancerSchema);
