const mongoose = require("mongoose");

const sequenceSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: {
    required: true,
    type: String,
    trim: true,
  },
  templates: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Template" }],
    default: [],
  },
});

const SequenceModel = mongoose.model("Sequence", sequenceSchema);
module.exports = { SequenceModel };
