const express = require("express");
const { getAllJobs } = require("../../controllers/jobs");
const { requireSignIn } = require("../auth/middleware");
const jobRouter = express.Router();

jobRouter.get("/jobs", ...requireSignIn, getAllJobs);

module.exports = { jobRouter };
