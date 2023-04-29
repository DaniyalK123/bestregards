const { BulkjobModel } = require("../../../models/Bulkjob");
const {
  mapVariablesToValues,
  getTemplateCustomContactVariables,
  allContactVariablesExist,
} = require("../utilities");
const { createEmails } = require("./createEmails");
const { executeBulkJob } = require("./executeJob");

const getAllBulkjobs = (req, res) => {
  BulkjobModel.find({ user: req.auth._id }).exec((err, bulkjobs) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    return res.json({ bulkjobs });
  });
};

const createBulkjob = async (req, res) => {
  const newJob = new BulkjobModel({
    user: req.auth._id,
    contacts: req.body.contactIds,
    template: req.body.templateId,
    name: req.body.name,
    subject: req.body.subject,
  });

  const { templateVariables, templateVariableValues } = req.body;

  if (
    !templateVariables ||
    !templateVariableValues ||
    templateVariables.length !== templateVariableValues.length
  ) {
    return res.sendStatus(500);
  }

  const variablesToValuesMap = mapVariablesToValues(
    templateVariables,
    templateVariableValues
  );

  const customContactVariables = await getTemplateCustomContactVariables(
    req.body.templateId,
    req.body.templateVariables
  );

  for (let i = 0; i < req.body.contactIds.length; i++) {
    const check = await allContactVariablesExist(
      customContactVariables,
      req.body.contactIds[i]
    );
    if (check.err) {
      return res.status(500).json({ check });
    }
  }

  const emailsToSend = await createEmails(
    req.auth._id,
    req.body.templateId,
    req.body.contactIds,
    variablesToValuesMap,
    req.body.subject
  );

  newJob.emailsToSend = emailsToSend;
  newJob.totalEmails = emailsToSend.length;
  await newJob.save();
  executeBulkJob(newJob._id);
  return res.sendStatus(200);
};

const searchName = async (req, res) => {
  //search for a bulkjob with a special name
  try {
    // get all bulkjob in database
    let bulkjob = await BulkjobModel.find({ name: req.param.name }).exec();

    // return gotten bulkjobs
    return res.status(200).json(bulkjob);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

module.exports = {
  getAllBulkjobs,
  createBulkjob,
  searchName,
};
