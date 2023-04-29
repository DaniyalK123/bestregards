const { UserModel } = require("../../models/User");
const { Nylas } = require("../../nylas");
const axios = require("axios");

Nylas.config({
  clientId: process.env.NYLAS_CLIENT_ID,
  clientSecret: process.env.NYLAS_CLIENT_SECRET,
});
const NYLAS_SCOPES = [
  "email.read_only",
  "email.send",
  "email.folders_and_labels",
  "email.metadata",
];

const getNylasEmail = async (req, res) => {
  const user = await UserModel.findById(req.auth._id).exec();
  if (!user.nylasEmail || !user.nylasEmail.accessToken) {
    return res.sendStatus(404);
  } else {
    return res.json({ registeredEmail: user.nylasEmail.address });
  }
};

// triggered when user requests to connect email to Nylas from the front-end
const initNylasAuthentication = (req, res) => {
  options = {
    redirectURI: process.env.NYLAS_CALLBACK_URL,
    scopes: NYLAS_SCOPES,
    state: JSON.stringify({ userId: req.auth._id }),
  };
  res.json({ authUrl: Nylas.urlForAuthentication(options) });
};

// triggered when user signs in on Nylas' Hosted Authentication (this route will be triggered by Nylas)
const nylasAuthenticationHandler = (req, res) => {
  // make sure userId has been passed as state
  if (!req.query.state) {
    return res.sendStatus(400);
  }
  let userId = "";
  try {
    userId = JSON.parse(req.query.state).userId;
    if (!userId) {
      return res.sendStatus(400);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }

  if (req.query.code) {
    Nylas.exchangeCodeForToken(req.query.code).then((token) => {
      console.log("GOT TOKEN", token);
      const nylas = Nylas.with(token);
      nylas.account.get().then((account) => {
        UserModel.updateOne(
          { _id: userId },
          {
            $set: {
              nylasEmail: {
                accessToken: token,
                address: account.emailAddress,
              },
            },
          }
        )
          .exec()
          .then(() => {
            return res.redirect(process.env.NYLAS_REDIRECT_URL);
          });
      });
    });
  } else if (req.query.error) {
    res.render("error", {
      message: req.query.reason,
      error: {
        status:
          "Please try authenticating again or use a different email account.",
        stack: "",
      },
    });
  }
};

const disconnectNylasEmail = (req, res) => {
  UserModel.updateOne(
    { _id: req.auth._id },
    { $set: { nylasEmail: { accessToken: "", address: "" } } }
  )
    .exec()
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

module.exports = {
  getNylasEmail,
  initNylasAuthentication,
  nylasAuthenticationHandler,
  disconnectNylasEmail,
};
