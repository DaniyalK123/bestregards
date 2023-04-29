const mongoose = require("mongoose");
const { emailSchema } = require("./Email");

const dripSequenceJobSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    sequence: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sequence",
      required: true,
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
    sendingHours: {
      type: [Number],
      required: true,
    },
    notify: {
      type: Boolean,
      default: false,
    },
    minimumDelay: {
      type: Number,
      default: 60,
    },
    lastMessageSentIndex: {
      type: Number,
      default: -1,
    },
    lastMessageSentTime: {
      type: Date,
      default: null,
    },
    variablesToValuesMap: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      default: "running",
      enum: ["paused", "running", "completed"],
    },
    sentEmails: { type: Number, default: 0 },
    totalEmails: Number,
    nylasThreadId: { type: String, required: true },
    emailsToSend: {
      type: [emailSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const DripSequenceJobModel = mongoose.model(
  "DripSequenceJob",
  dripSequenceJobSchema
);
module.exports = { DripSequenceJobModel };
