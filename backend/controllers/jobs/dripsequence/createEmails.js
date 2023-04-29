const { SequenceModel } = require("../../../models/Sequence");
const { ContactModel } = require("../../../models/Contact");
const { EmailModel } = require("../../../models/Email");
const { dripSequenceRouter } = require("../../../routes/jobs/dripsequence");
const { FIXED_CONTACT_VARIABLES } = require("../utilities");

const createEmails = async (dripSequence, variableToValueMap, subject) => {
  const contact = await ContactModel.findById(dripSequence.contact);
  const sequence = await SequenceModel.findById(dripSequence.sequence)
    .populate("templates")
    .exec();
  if (!contact || !sequence) {
    return [];
  }
  const emailSequence = [];
  for (let i = 0; i < sequence.templates.length; i++) {
    // populate this template
    const template = sequence.templates[i];
    let body = template.message;
    let templateVariables = Object.keys(variableToValueMap);
    // populate all template variables
    templateVariables.forEach((variable) => {
      body = body.replaceAll(`$${variable}!`, variableToValueMap[variable]);
    });

    console.log(body);
    // populate fixed contact variables
    FIXED_CONTACT_VARIABLES.forEach((variable) => {
      body = body.replaceAll(`$${variable}!`, contact[variable]);
    });
    console.log(body);

    const customVariables = Object.keys(contact.customVariables);
    customVariables.forEach((variable) => {
      body = body.replaceAll(
        `$${variable}!`,
        contact.customVariables[variable]
      );
    });

    const emailToSend = new EmailModel({
      user: dripSequence.user,
      contact: dripSequence.contact,
      jobType: "drip",
      subject,
      body,
      recipient: contact.email,
    });
    emailSequence.push(emailToSend);
  }
  return emailSequence;
};

module.exports = { createEmails };
