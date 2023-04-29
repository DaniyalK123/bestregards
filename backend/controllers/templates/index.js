const { TemplateModel } = require("../../models/Template");
const { SequenceModel } = require("../../models/Sequence");

const seedTemplates = async (req, res) => {
  for (let i = 0; i < 5; i++) {
    await TemplateModel.create({
      name: `template ${i + 1}`,
      message: `Template ${i + 1} message`,
      user: req.auth._id,
    });
  }
  return res.sendStatus(200);
};

const getAllTemplates = (req, res) => {
  TemplateModel.find({ user: req.auth._id }).exec((err, templates) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    console.log("found templates", templates);
    return res.json({ templates });
  });
};

const getTemplate = (req, res) => {
  TemplateModel.findById(req.params.templateId).exec((err, template) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    return res.json({ template });
  });
};

const createTemplate = (req, res) => {
  TemplateModel.create({ user: req.auth._id, ...req.body }).then((newTemplate) => {
    return res.send(newTemplate._id);
  });
};

const updateTemplate = (req, res) => {
  TemplateModel.updateOne(
    { _id: req.params.templateId },
    { $set: { ...req.body } }
  )
    .then(() => {
      return res.sendStatus(200);
    })
    .catch(() => {
      return res.sendStatus(500);
    });
};

const deleteTemplate = (req, res) => {
  const actualDeleteTemplate = (userId, templateId, res) => TemplateModel.deleteOne({
    _id: templateId,
    user: userId,
  }).exec((err, _) => {
    console.log("Delete Template:", templateId);
    if (err) {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });

  deleteTemplateFromSequence(req.auth._id, req.params.templateId, res, actualDeleteTemplate);

};

const deleteTemplateFromSequence = (userId, templateId, res, callback) => {
  SequenceModel.find({ user: userId })
      .populate("templates")
      .exec((err, sequences) => {
        if (err) {
          console.log(err);
        }
        console.log("DELETING Template From Sequence!");
        for (let i=0; i<sequences.length; i++) {
          const curSequence = sequences[i];
          for (let j=0; j<curSequence.templates.length; j++) {
            const curTemplate = curSequence.templates[j];
            if(curTemplate._id == templateId) {
              const newTemplates = curSequence.templates.filter((T) => T._id != templateId);
              SequenceModel.updateOne(
                  { _id: curSequence._id },
                  { $set: { templates:newTemplates } }
              ).exec((err) => {
                if (err) return res.sendStatus(500);

              });
            }
          }
        }
        callback(userId, templateId, res);
      });
}

module.exports = {
  getTemplate,
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  seedTemplates,
};
