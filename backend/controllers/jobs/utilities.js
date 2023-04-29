const { ContactModel } = require("../../models/Contact");
const { SequenceModel } = require("../../models/Sequence");
const { TemplateModel } = require("../../models/Template");

const FIXED_CONTACT_VARIABLES = ["firstName", "surName", "email", "company"];

const mapVariablesToValues = (templateVariables, templateVariableValues) => {
  const variablesToValuesMap = {};

  templateVariables.forEach((variable, index) => {
    variablesToValuesMap[variable] = templateVariableValues[index];
  });

  return variablesToValuesMap;
};

const getSequenceCustomContactVariables = async (
  sequenceId,
  templateVariables
) => {
  const sequence = await SequenceModel.findById(sequenceId).exec();
  let allVariables = [];
  for (let i = 0; i < sequence.templates.length; i++) {
    allVariables = [
      ...allVariables,
      ...(await getTemplateCustomContactVariables(
        sequence.templates[i],
        templateVariables
      )),
    ];
  }
  return allVariables;
};

// filter out the custom variables from a contact
const getTemplateCustomContactVariables = async (
  templateId,
  templateVariables
) => {
  const template = await TemplateModel.findById(templateId).exec();
  const templateBody = template.message;
  let variables = templateBody.match(/(?<=\$).+?(?=\!)/g);
  if (!variables) {
    variables = [];
  }
  variables = variables.filter(
    (variable) =>
      !templateVariables.includes(variable) &&
      !FIXED_CONTACT_VARIABLES.includes(variable)
  );

  return variables;
};

// check if the contact contains all the contact variables specified in the template
const allContactVariablesExist = async (
  templateCustomContactVariables,
  contactId
) => {
  if (
    templateCustomContactVariables.length &&
    templateCustomContactVariables.length === 0
  ) {
    return { err: false };
  }
  const contact = await ContactModel.findById(contactId).exec();
  const customVariables = Object.keys(contact.customVariables);
  console.log("customVariables", customVariables);
  console.log("templateCustomContactVariables", templateCustomContactVariables);

  for (let i = 0; i < templateCustomContactVariables.length; i++) {
    templateVariable = templateCustomContactVariables[i];
    console.log("checking", templateVariable);
    if (!customVariables.includes(templateVariable)) {
      console.log("=== NOT FOUND ===");
      return {
        err: true,
        variable: templateVariable,
        contact: contact.firstName + " " + contact.surName,
      };
    }
  }

  return { err: false };
};

module.exports = {
  mapVariablesToValues,
  getTemplateCustomContactVariables,
  allContactVariablesExist,
  getSequenceCustomContactVariables,
  FIXED_CONTACT_VARIABLES,
};
