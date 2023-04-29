const { ContactModel } = require("../../../models/Contact");
const { EmailModel } = require("../../../models/Email");
const { TemplateModel } = require("../../../models/Template");
const { FIXED_CONTACT_VARIABLES } = require("../utilities");

const createEmails = async (
  userId,
  templateId,
  contactIds,
  variableToValueMap,
  subject
) => {
  const emailsToSend = [];
  const template = await TemplateModel.findById(templateId).exec();
  for (let i = 0; i < contactIds.length; i++) {
    // populate this template
    let contact = await ContactModel.findById(contactIds[i]).exec();
    console.log("EMAIL SEND CONTACT", contact);
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
      user: userId,
      contact: contact._id,
      jobType: "bulk",
      subject,
      body,
      recipient: contact.email,
    });
    emailsToSend.push(emailToSend);
  }
  return emailsToSend;
};

module.exports = { createEmails };
