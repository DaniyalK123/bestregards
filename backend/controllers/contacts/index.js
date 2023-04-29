const { ContactModel } = require("../../models/Contact");
const cloudinary = require("cloudinary").v2;

const getAllContacts = (req, res) => {
  ContactModel.find({ user: req.auth._id }).exec((err, contacts) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    console.log("CONTACTS", contacts);
    return res.json({ contacts });
  });
};

const getAllCustomVariables = (req, res) => {
  ContactModel.find({ user: req.auth._id }).exec((err, contacts) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    const customVariables = [];
    for (let i = 0; i < contacts.length; i++) {
      for (k in contacts[i].customVariables) {
        if (!customVariables.includes(k)) customVariables.push(k);
      }
    }
    console.log("CUSTOMVARIABLES", customVariables);
    return res.json({ customVariables });
  });
};

const getContact = (req, res) => {
  ContactModel.findById(req.params.contactId).exec((err, contact) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    return res.json({ contact });
  });
};

const createContact = async (req, res) => {
  console.log("running create contact");
  let existingContact = await ContactModel.findOne({
    user: req.auth._id,
    email: req.body.email,
  }).exec();
  if (existingContact) {
    return res
      .status(400)
      .json({ err: "Contact with this email already exists" });
  }

  // console.log("custom vars", JSON.parse(req.body.customVariables));
  ContactModel.create({
    user: req.auth._id,
    avatarURL: req.imageURL ? req.imageURL : "",
    avatarAssetID: req.imageAssetID ? req.imageAssetID : "",
    ...req.body,
    customVariables: req.body.customVariables
      ? JSON.parse(req.body.customVariables)
      : {},
  }).then(() => {
    return res.sendStatus(200);
  });
};

const updateContact = (req, res) => {
  console.log("running update contact");
  ContactModel.updateOne(
    { _id: req.params.contactId },
    {
      $set: {
        avatarURL: req.imageURL ? req.imageURL : "",
        avatarAssetID: req.imageAssetID ? req.imageAssetID : "",
        ...req.body,
        customVariables: req.body.customVariables
          ? JSON.parse(req.body.customVariables)
          : {},
      },
    }
  )
    .then(() => {
      return res.sendStatus(200);
    })
    .catch(() => {
      return res.sendStatus(500);
    });
};

const deleteContact = async (req, res) => {
  const contact = await ContactModel.findById(req.params.contactId).exec();
  // delete avatar from cloudinary
  if (contact && contact.avatarAssetID) {
    cloudinary.uploader.destroy(contact.avatarAssetID);
  }
  // delete contact
  ContactModel.deleteOne({
    _id: req.params.contactId,
    user: req.auth._id,
  }).exec((err, _) => {
    if (err) {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
};
const searchEmail = async (req, res) => {
  //search for a contact with a special name
  try {
    // get all contacts in database
    let contacts = await ContactModel.find({
      email: req.params.keyword,
    }).exec();

    // return gotten contacts
    return res.status(200).json(contacts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

const addVariableToContacts = async (req, res) => {
  const contacts = await ContactModel.find({ user: req.auth._id }).exec();

  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    if (!contact.customVariables[req.body.variableName]) {
      console.log("adding variable");
      contact.customVariables = {
        ...contact.customVariables,
        [req.body.variableName]: req.body.defaultValue,
      };
      console.log(contact.customVariables);
      await contact.save();
      console.log("saved");
    }
  }
  return res.sendStatus(200);
};

module.exports = {
  getAllContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
  searchEmail,
  getAllCustomVariables,
  addVariableToContacts,
};
