const { DripSequenceJobModel } = require("../../models/DripSequenceJob");
const { UserModel } = require("../../models/User");
const { Nylas } = require("../../nylas");

const PAGE_LIMIT = 50;

function simplifyThread(thread) {
  return {
    id: thread.id,
    subject: thread.subject,
    from: thread.from,
    participants: thread.participants,
    date: thread.lastMessageTimestamp,
    snippet: thread.snippet,
    unread: thread.unread,
    hasAttachments: thread.hasAttachments,
  };
}

// compares retrieved threads with the sequences started by the user
async function addJobStatusToThreads(threads, userId) {
  const dripSequenceJobs = await DripSequenceJobModel.find({
    user: userId,
  })
    .sort({ createdAt: 1 })
    .exec();
  dripSequenceJobs.forEach((job) => {
    for (let i = 0; i < threads.length; i++) {
      if (threads[i].id === job.nylasThreadId) {
        console.log("MATCHED THREAD WITH ID", job.nylasThreadId);
        threads[i].status = job.status;
        threads[i].dripSequenceId = job._id;
      }
    }
  });

  return threads.map((thread) => {
    return { ...thread, status: thread.status ? thread.status : "none" };
  });
}

const getThreads = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.auth._id }).exec();
  if (!user.nylasEmail || !user.nylasEmail.accessToken) {
    return res.json({ emailRegistered: false });
  }
  console.log("Using token", user.nylasEmail.accessToken);
  const nylas = Nylas.with(user.nylasEmail.accessToken);

  const page = req.query.page >= 1 ? req.query.page : 1;
  const pagination = {
    limit: PAGE_LIMIT + 1,
    offset: (page - 1) * PAGE_LIMIT,
  };

  let box;
  if (req.query.box) {
    box = req.query.box;
  } else {
    box = "inbox";
  }

  console.log(req.query);

  if (req.query.search) {
    console.log("WITH SEARCH QUERY");
    nylas.threads
      .search(req.query.search, {
        offset: 0,
        limit: PAGE_LIMIT,
      })
      .then(async (threads) => {
        return res.json({
          hasPrevious: false,
          hasNext: false,
          threads: await addJobStatusToThreads(
            threads.map(simplifyThread).slice(0, PAGE_LIMIT),
            req.auth._id
          ),
          emailRegistered: true,
        });
      });
  } else {
    console.log("WITHOUT SEARCH QUERY");
    nylas.threads.list({ ...pagination, in: box }).then(async (threads) => {
      console.log("GOT THREADS", threads);
      return res.json({
        hasPrevious: page > 1,
        hasNext: threads.length > PAGE_LIMIT,
        threads: await addJobStatusToThreads(
          threads.map(simplifyThread).slice(0, PAGE_LIMIT),
          req.auth._id
        ),
        emailRegistered: true,
      });
    });
  }
};

module.exports = { getThreads };
