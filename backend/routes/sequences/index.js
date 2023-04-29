const express = require("express");
const {
  getAllSequences,
  getSequence,
  createSequence,
  deleteSequence,
  updateSequence,
} = require("../../controllers/sequences");
const { requireSignIn } = require("../auth/middleware");
const sequenceRouter = express.Router();

sequenceRouter.get("/sequences", ...requireSignIn, getAllSequences);

sequenceRouter.get("/sequences/:sequenceId", ...requireSignIn, getSequence);

sequenceRouter.post("/sequences", ...requireSignIn, createSequence);

sequenceRouter.patch(
  "/sequences/:sequenceId",
  ...requireSignIn,
  updateSequence
);

sequenceRouter.delete(
  "/sequences/:sequenceId",
  ...requireSignIn,
  deleteSequence
);

module.exports = { sequenceRouter };
