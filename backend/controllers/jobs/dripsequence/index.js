const { DripSequenceJobModel } = require("../../../models/DripSequenceJob");
const { SequenceModel } = require("../../../models/Sequence");
const {
  mapVariablesToValues,
  getSequenceCustomContactVariables,
  allContactVariablesExist,
} = require("../utilities");
const { createEmails } = require("./createEmails");

const getDripSequenceJob = (req, res) => {
  DripSequenceJobModel.findById(req.params.dripSequenceId).exec(
    (err, dripSequenceJob) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.json({ dripSequenceJob });
    }
  );
};

const createDripSequenceJob = async (req, res) => {
  const dripSequence = new DripSequenceJobModel({
    user: req.auth._id,
    nylasThreadId: req.body.threadId,
    ...req.body,
    emailsToSend: [],
  });
  // create all emails
  const { templateVariables, templateVariableValues, startHour, endHour } =
    req.body;
  if (
    !templateVariables ||
    !templateVariableValues ||
    templateVariables.length !== templateVariableValues.length ||
    startHour > endHour
  ) {
    return res.sendStatus(500);
  }
  const sendingHours = [];
  for (let i = startHour; i <= endHour; i++) {
    sendingHours.push(i);
  }

  const variablesToValuesMap = mapVariablesToValues(
    templateVariables,
    templateVariableValues
  );

  const customContactVariables = await getSequenceCustomContactVariables(
    dripSequence.sequence,
    req.body.templateVariables
  );

  console.log("sequence variables", customContactVariables);

  const check = await allContactVariablesExist(
    customContactVariables,
    dripSequence.contact
  );
  if (check.err) {
    return res.status(500).json({ check });
  }

  const emailsToSend = await createEmails(
    dripSequence,
    variablesToValuesMap,
    req.body.subject
  );
  dripSequence.sendingHours = sendingHours;
  dripSequence.emailsToSend = emailsToSend;
  dripSequence.totalEmails = emailsToSend.length;
  dripSequence.variablesToValuesMap = variablesToValuesMap;
  await dripSequence.save();
  return res.sendStatus(200);
};

updateDripSequence = async (req, res) => {
  await DripSequenceJobModel.findOneAndUpdate(
    {
      _id: req.params.dripSequenceId,
      user: req.auth._id,
    },
    {
      $set: {
        status: req.body.status,
      },
    }
  ).exec();
  return res.sendStatus(200);
};

deleteDripSequenceJob = async (req, res) => {
  await DripSequenceJobModel.deleteOne({
    _id: req.params.dripSequenceId,
    user: req.auth._id,
  }).exec();
  return res.sendStatus(200);
};

module.exports = {
  createDripSequenceJob,
  getDripSequenceJob,
  updateDripSequence,
  deleteDripSequenceJob,
};
