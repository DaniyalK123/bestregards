const { SequenceModel } = require("../../models/Sequence");

const getAllSequences = (req, res) => {
  SequenceModel.find({ user: req.auth._id })
    .populate("templates")
    .exec((err, sequences) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.json({ sequences });
    });
};

const getSequence = (req, res) => {
  SequenceModel.findById(req.params.sequenceId)
    .populate("templates")
    .exec((err, sequence) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.json({ sequence });
    });
};

const createSequence = (req, res) => {
  SequenceModel.create({ user: req.auth._id, ...req.body }).then(() => {
    return res.sendStatus(200);
  });
};

const updateSequence = (req, res) => {
  SequenceModel.updateOne(
    { _id: req.params.sequenceId },
    { $set: { ...req.body } }
  )
    .then(() => {
      return res.sendStatus(200);
    })
    .catch(() => {
      return res.sendStatus(500);
    });
};

const deleteSequence = (req, res) => {
  SequenceModel.deleteOne({
    _id: req.params.sequenceId,
    user: req.auth._id,
  }).exec((err, _) => {
    if (err) {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
};

module.exports = {
  getSequence,
  getAllSequences,
  createSequence,
  updateSequence,
  deleteSequence,
};
