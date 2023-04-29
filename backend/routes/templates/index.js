const express = require("express");
const {
  getAllTemplates,
  getTemplate,
  createTemplate,
  deleteTemplate,
  updateTemplate,
  seedTemplates,
} = require("../../controllers/templates");
const { requireSignIn } = require("../auth/middleware");
const templateRouter = express.Router();

templateRouter.get("/templates/seed", ...requireSignIn, seedTemplates);

templateRouter.get("/templates", ...requireSignIn, getAllTemplates);

templateRouter.get("/templates/:templateId", ...requireSignIn, getTemplate);

templateRouter.post("/templates", ...requireSignIn, createTemplate);

templateRouter.patch(
  "/templates/:templateId",
  ...requireSignIn,
  updateTemplate
);

templateRouter.delete("/templates/:templateId", requireSignIn, deleteTemplate);

module.exports = { templateRouter };
