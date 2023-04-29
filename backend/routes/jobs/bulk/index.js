const express = require("express");
const {
  createBulkjob,
  getAllBulkjobs,
} = require("../../../controllers/jobs/bulk");
const { requireSignIn } = require("../../auth/middleware");
const bulkjobRouter = express.Router();

bulkjobRouter.post("/bulkjob", ...requireSignIn, createBulkjob);
bulkjobRouter.get("/bulkjob", ...requireSignIn, getAllBulkjobs);

module.exports = { bulkjobRouter };
