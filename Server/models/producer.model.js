import mongoose, { Schema } from "mongoose";
import { Jobs } from "./jobs.model.js";
const producerSchema = new Schema(
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
    honors: {
      type: String,
      ref: Jobs,
    },
  },
  { timestamps: true }
);

export const Producer = mongoose.model("Producer", producerSchema);
