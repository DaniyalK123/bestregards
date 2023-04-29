const mongoose = require("mongoose");
const { emailSchema } = require("./Email");

const bulkjobSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      required: true,
      type: String,
      trim: true,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    contacts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contact" }],
      default: [],
    },
    sentEmails: { type: Number, default: 0 },
    totalEmails: Number,
    variablesToValuesMap: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    subject: String,
    status: {
      type: String,
      default: "running",
      enum: ["paused", "running", "completed"],
    },
    emailsToSend: {
      type: [emailSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const BulkjobModel = mongoose.model("Bulkjob", bulkjobSchema);
module.exports = { BulkjobModel };
