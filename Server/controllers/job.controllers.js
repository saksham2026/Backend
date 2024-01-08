import asyncHandler from "express-async-handler";
import { Jobs } from "../models/jobs.model.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Proposal } from "../models/jobproposals.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { jobMatch } from "../models/acceptedjobs.js";
const jobApply = asyncHandler(async (req, res, next) => {
  const { jobId } = req.body;
  const userId = req._id;

  const job = await Jobs.findById(jobId).select("email");
  if (!job) throw new ApiError(406, "Job no longer exists");

  const producer = await User.findOne({ email: job.email }).select("_id");
  const freelancer = await User.findById(userId).select("_id");

  if (!freelancer) throw new ApiError(407, "Can not find Freelancer");

  const proposalExist = await Proposal.find({
    $and: [
      {
        producer,
      },
      {
        freelancer,
      },
      {
        jobId,
      },
    ],
  });

  if (proposalExist.length > 0) throw new ApiError(409, "Already Applied");

  const proposal = {
    freelancer: freelancer._id,
    jobId,
    producer: producer._id,
  };

  const newProposal = await Proposal.create(proposal);

  res
    .status(200)
    .json(
      new ApiResponse(200, newProposal, "Job Application sent successfully")
    );
});

const getPropoposals = asyncHandler(async (req, res, next) => {
  const producer = req._id;
  const proposals = await Proposal.find({ producer })
    .populate("jobId")
    .populate("producer")
    .populate("freelancer");

  if (!proposals) throw new ApiError(400, "Can not Find Proposals");
  res
    .status(200)
    .json(new ApiResponse(200, proposals, "Proposals fetched successfully"));
});

const acceptProposal = asyncHandler(async (req, res, next) => {
  const { jobId, freelancer } = req.body;
  const producer = req._id;

  // Checking if all of the, jobId, freelancer and the producer are non-empty.
  if (!jobId || !freelancer || !producer)
    throw new ApiError(403, "All fields are required");

  // Checking if the values are valid.
  const isValidFreelancer = await User.findById(freelancer);
  const isValidProducer = await User.findById(producer);
  const isValidJob = await Jobs.findById(jobId);

  // Throwing an error, if one of the above values are invalid.
  if (!isValidJob) throw new ApiError(410, "Job has been closed");
  if (!isValidFreelancer) throw new ApiError(411, "Freelancer does not exist");

  const newAcceptedProposal = {
    jobId,
    freelancer,
    producer,
  };

  // Added the acceptedProposal in the acceptedJobs Database.
  const acceptedProposal = await jobMatch.create(newAcceptedProposal);

  // After this, we will remove the Job from the Jobs database, as it has been closed.
  await Jobs.findByIdAndDelete(jobId);

  // Also, we will have to delete all the proposals of the given, jobId.
  await Proposal.deleteMany({
    $and: [
      {
        jobId,
      },
    ],
  });

  // We also need to delete that Job from the Jobs Database.
  await Jobs.findByIdAndDelete(jobId);

  // After this we have to send a response, showing successfull Job Match.
  res.status(200).json( new ApiResponse(200, acceptProposal, "Job filled Successfully"));
});

const rejectProposal = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const { freelancer, jobId } = req.body;
    const producer = req._id;
    // Checking if all the above values are non-empty

    if(!freelancer || !producer || !jobId) throw new ApiError(400, "All values are required");

    // Checking if all the values are valid.

    const isValidFreelancer = await User.findById(freelancer);
    const isValidProducer = await User.findById(producer);
    const isValidJob = await Jobs.findById(jobId);

    if(!isValidFreelancer) throw new ApiError(410, "Freelancer does not exists");
    if(!isValidProducer) throw new ApiError(411, "Producer does not exists");
    if(!isValidJob) throw new ApiError(412, "Job no longer exists.");

    // If the request for rejecting a Job proposal is valid, we will delete the particular Proposal from the Proposal Database.

    await Proposal.deleteOne({
        $and: [
            {
                jobId,
            },
            {
                freelancer,
            },
            {
                producer,
            }
        ]
    });

    res.status(200).json(new ApiResponse(200, {}, "Rejected Successfully"));

});

export { jobApply, getPropoposals, acceptProposal, rejectProposal };
