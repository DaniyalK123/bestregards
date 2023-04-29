const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: {
      required: true,
      type: String,
      trim: true,
      maxLength: 50,
    },
    surName: {
      required: true,
      type: String,
      trim: true,
      maxLength: 50,
    },
    email: {
      required: true,
      type: String,
      trim: true,
    },
    company: {
      required: false,
      type: String,
      trim: true,
      default: "",
    },
    customVariables: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    avatarURL: {
      type: String,
      default: "",
    },
    avatarAssetID: {
      type: String,
      default: "",
    },
  },
  { minimize: false }
);

const ContactModel = mongoose.model("Contact", contactSchema);
module.exports = { ContactModel };
