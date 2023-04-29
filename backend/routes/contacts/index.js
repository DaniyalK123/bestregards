const express = require("express");
const {
  getAllContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
  addOne,
  addDefault,
  searchEmail,
  getAllCustomVariables,
  addVariableToContacts,
} = require("../../controllers/contacts");
const multer = require("multer");
var storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { uploadToCloudinary } = require("./middleware");

const { requireSignIn } = require("../auth/middleware");
const contactRouter = express.Router();

contactRouter.get("/contacts", ...requireSignIn, getAllContacts);

contactRouter.get("/contacts/search/:keyword", ...requireSignIn, searchEmail);

contactRouter.get(
  "/contacts/customVariables",
  ...requireSignIn,
  getAllCustomVariables
);

contactRouter.post(
  "/contacts/customVariables",
  ...requireSignIn,
  addVariableToContacts
);

contactRouter.get("/contacts/:contactId", ...requireSignIn, getContact);

contactRouter.post(
  "/contacts",
  ...requireSignIn,
  upload.single("avatar"),
  uploadToCloudinary,
  createContact
);

contactRouter.post(
  "/contacts/update/:contactId",
  ...requireSignIn,
  upload.single("avatar"),
  uploadToCloudinary,
  updateContact
);

contactRouter.delete("/contacts/:contactId", ...requireSignIn, deleteContact);

module.exports = { contactRouter };
