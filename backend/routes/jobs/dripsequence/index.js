const express = require("express");
const {
  createDripSequenceJob,
  getDripSequenceJob,
  deleteDripSequenceJob,
  updateDripSequence,
} = require("../../../controllers/jobs/dripsequence");
const { requireSignIn } = require("../../auth/middleware");
const dripSequenceRouter = express.Router();

dripSequenceRouter.get(
  "/dripSequences/:dripSequenceId",
  ...requireSignIn,
  getDripSequenceJob
);

dripSequenceRouter.post(
  "/dripSequences",
  ...requireSignIn,
  createDripSequenceJob
);

dripSequenceRouter.delete(
  "/dripSequences/:dripSequenceId",
  ...requireSignIn,
  deleteDripSequenceJob
);

dripSequenceRouter.patch(
  "/dripSequences/:dripSequenceId",
  ...requireSignIn,
  updateDripSequence
);

module.exports = { dripSequenceRouter };
