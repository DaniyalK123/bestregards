const { BulkjobModel } = require("../../models/Bulkjob");
const { DripSequenceJobModel } = require("../../models/DripSequenceJob");

const sortByCreatedDate = (job1, job2) => {
  return new Date(job1.createdAt) > new Date(job2.createdAt) ? -1 : 1;
};

const getAllJobs = (req, res) => {
  let query = { user: req.auth._id };
  if (req.query.lastWeek) {
    query.createdAt = { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) };
  }
  const bulkJobsPromise = BulkjobModel.find(query).exec();
  const dripJobsPromise = DripSequenceJobModel.find(query).exec();
  Promise.all([bulkJobsPromise, dripJobsPromise]).then((result) => {
    let bulkJobs = result[0];
    let dripJobs = result[1];

    bulkJobs = bulkJobs.map((job) => {
      return { ...job._doc, type: "bulk" };
    });
    dripJobs = dripJobs.map((job) => {
      return { ...job._doc, type: "drip" };
    });

    let combinedJobs = [...bulkJobs, ...dripJobs];
    let jobs = combinedJobs.sort(sortByCreatedDate);

    jobs = jobs.map((j) => {
      return {
        _id: j._id,
        name: j.name,
        totalEmails: j.totalEmails,
        sentEmails: j.sentEmails,
        status: j.status,
        date: j.createdAt,
        type: j.type,
      };
    });

    console.log(jobs);
    return res.json({ jobs });
  });
};

module.exports = { getAllJobs };
