const mongoose = require("mongoose");

const templateSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: {
    required: true,
    type: String,
    trim: true,
  },
  templateVariables: {
    type: [String],
  },
  contactVariables: {
    type: [String],
  },
  message: {
    type: String,
  }
});

const TemplateModel = mongoose.model("Template", templateSchema);
module.exports = { TemplateModel };
