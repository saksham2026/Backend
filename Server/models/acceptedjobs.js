import mongoose, { Mongoose, Schema } from "mongoose";

const acceptedJobSchema = new Schema(
    // This is a schema in which a entry will be made, whenever a freelancer is hired for a job.
  {
    jobId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs",
        required: true,
    },
    producer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producer",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer",
      required: true,
    },
  },
  { timestamps: true }
);

export const jobMatch = mongoose.model("jobMatch", acceptedJobSchema);
