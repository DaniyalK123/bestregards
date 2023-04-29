const express = require("express");
const {
  getNylasEmail,
  nylasAuthenticationHandler,
  initNylasAuthentication,
  disconnectNylasEmail,
} = require("../../controllers/user");
const { requireSignIn } = require("../auth/middleware");
const userRouter = express.Router();

userRouter.get("/nylas/auth", ...requireSignIn, initNylasAuthentication);

userRouter.get("/nylas", ...requireSignIn, getNylasEmail);

userRouter.get("/nylas/callback", nylasAuthenticationHandler);

userRouter.delete("/nylas", ...requireSignIn, disconnectNylasEmail);
module.exports = { userRouter };
