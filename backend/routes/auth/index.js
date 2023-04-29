const express = require("express");
const { body } = require("express-validator");
const { signIn, signUp } = require("../../controllers/auth");

const authRouter = express.Router();

authRouter.post(
  "/api/signup",
  [
    body("email", "Email must be valid.").isEmail(),
    body(
      "password",
      "Password must include one lowercase character, one uppercase character, a number, and a special character."
    ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  ],
  signUp
);

authRouter.post("/api/signin", signIn);

module.exports = { authRouter };
