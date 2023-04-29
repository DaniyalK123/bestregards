const expressJwt = require("express-jwt");
const { JWT_SECRET } = process.env;
const { UserModel } = require("../../models/User");

// Check if the authenticated user is the same as the user whose resource is being requested
const isAuth = (req, res, next) => {
  req.auth._id;

  let user =
    req.profile && req.auth && req.profile._id.toString() === req.auth._id;

  if (!user) {
    return res.status(403).json({
      err: "Access denied",
    });
  }

  next();
};

// Check if the user is logged in
const requireSignIn = [
  expressJwt({
    secret: JWT_SECRET,
    userProperty: "auth",
    algorithms: ["HS256"],
  }),
  function (err, req, res, next) {
    console.log("UNAUTHORIZED");
    res.status(err.status).json(err);
  },
];

module.exports = { requireSignIn };
