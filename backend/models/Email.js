const mongoose = require("mongoose");

const emailSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  subject: String,
  body: String,
  sentTime: {
    type: Number,
    default: -1,
  },
  jobType: {
    type: String,
    enum: ["bulk", "drip"],
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "sent"],
  },
});

const EmailModel = mongoose.model("Email", emailSchema);
module.exports = { EmailModel, emailSchema };
