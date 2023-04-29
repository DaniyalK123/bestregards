const express = require("express");
const { getThreads } = require("../../controllers/threads");
const { requireSignIn } = require("../auth/middleware");
const threadRouter = express.Router();

threadRouter.get("/threads", ...requireSignIn, getThreads);

module.exports = { threadRouter };
