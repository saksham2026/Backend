import express from "express";
import { Register } from "../controllers/user.register.controller.js";
import { upload } from "../utils/multer.js";
import { LoginUser } from "../controllers/user.login.controller.js";
import { jwtAuth } from "../middlewares/jwtAuth.middleware.js";
import { LogoutUser } from "../controllers/user.logout.controller.js";
import { updateAvatar } from "../controllers/user.controller.avatarupdate.js";
import { getUser } from "../controllers/getuser.js";
import { setUser } from "../controllers/user.set.controller.js";
import { getUserWithUsername } from "../controllers/producerpovfreelancer.js";
import { getProducersAndFreelancers } from "../controllers/getproducersandfreelancers.js";
import { sendMail } from "../controllers/sendmail.js";
import { postJob } from "../controllers/postjobs.js";
import { getJobs } from "../controllers/getjobs.controller.js";
import { getJobDetails } from "../controllers/getjobdetaisl.js";
import { getAllJobs } from "../controllers/getalljobs.js";
import { getJobsByUsername } from "../controllers/getjobsbyusername.js";
import { getRole } from "../controllers/user.getrole.js";
import { deleteJob } from "../controllers/deletejob.controller.js";
import { getFilteredJobs } from "../controllers/getfilteredjob.js";
import { getFilterFreelancers } from "../controllers/fiterfreelancers.controller.js";
import { acceptProposal, getMyJobs, getPropoposals, jobApply, rejectProposal } from "../controllers/job.controllers.js";
const Router = express.Router();
 
Router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  Register
);

Router.route("/login").post(LoginUser);
Router.route("/logout").post(jwtAuth, LogoutUser);
Router.route("/updateavatar").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  jwtAuth,
  updateAvatar
);
Router.route("/getuser").post(jwtAuth, getUser);
Router.route("/setuser").post(jwtAuth, setUser);
Router.route("/getuserwithusername").post(jwtAuth, getUserWithUsername);
Router.route("/getproducersandfreelancers").post(
  jwtAuth,
  getProducersAndFreelancers
);
Router.route("/sendmail").post(jwtAuth, sendMail);
Router.route("/postjob").post(jwtAuth, postJob);
Router.route("/getjobs").post(jwtAuth, getJobs);
Router.route("/getjobdetail").post(jwtAuth, getJobDetails);
Router.route("/getjobsbyusername").post(jwtAuth, getJobsByUsername);
Router.route("/getalljobs").post(jwtAuth, getAllJobs);
Router.route("/getrole").post(jwtAuth,getRole);
Router.route("/deletejob").post(jwtAuth, deleteJob);
Router.route("/filterjobs").post(jwtAuth, getFilteredJobs);
Router.route("/fiterfreelancers").post(jwtAuth, getFilterFreelancers);
Router.route("/jobapply").post(jwtAuth, jobApply);
Router.route("/getproposals").post(jwtAuth, getPropoposals);
Router.route("/accepted").post(jwtAuth, acceptProposal);
Router.route("/rejected").post(jwtAuth, rejectProposal);
Router.route("/myjobs").post(jwtAuth, getMyJobs);
export default Router;
