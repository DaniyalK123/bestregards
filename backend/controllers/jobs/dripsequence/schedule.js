const schedule = require("node-schedule");
const { executeDripSeqJob } = require("./executeJob");
const { DripSequenceJobModel } = require("../../../models/DripSequenceJob");

const rule = new schedule.RecurrenceRule();
rule.second = 5;

const scheduleJobs = () => {
  console.log("=== RUNNING SCHEDULE JOBS ===");
  schedule.scheduleJob(rule, function () {
    console.log("running scheduled job");
    DripSequenceJobModel.find({ status: "running" }).exec(
      async (err, dripSequenceJobs) => {
        if (err) {
          console.log(err);
        }
        console.log("found dripSequenceJobs", dripSequenceJobs);
        for (let i = 0; i < dripSequenceJobs.length; i++) {
          console.log("scheduling: ", dripSequenceJobs[i]._id);
          await executeDripSeqJob(dripSequenceJobs[i]);
        }
      }
    );
  });
};

module.exports = { scheduleJobs };
