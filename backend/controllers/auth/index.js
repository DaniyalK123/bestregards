const { UserModel } = require("../../models/User");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const signUp = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (!req.body.email) {
    return res.sendStatus(400);
  }

  req.body.email = req.body.email.toLowerCase();

  const user = new UserModel({
    ...req.body,
  });
  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  user.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        err: "Email already exists",
      });
    }
    user.salt = undefined;
    user.hashedPassword = undefined;

    return res.json({ user, token });
  });
};

const signIn = (req, res) => {
  const { password } = req.body;
  const email = req.body.email.toLowerCase();
  
  UserModel.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ err: "User does not exist." });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        err: "Invalid credentials",
      });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    const { _id, firstName, email, userType } = user;

    return res.json({ user: { _id, firstName, email, userType }, token });
  });
};

module.exports = {
  signUp,
  signIn,
};
