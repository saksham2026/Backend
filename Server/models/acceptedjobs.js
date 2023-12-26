import mongoose, { Mongoose, Schema } from "mongoose";

const acceptedJobSchema = new Schema(
    // This is a schema in which a entry will be made, whenever a freelancer is hired for a job.
  {
    jobId:{
        type: String,
        required: true,
    },
    producer: {
      type: String,
      required: true,
    },
    freelancer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const jobMatch = Mongoose.model("jobMatch", acceptedJobSchema);
