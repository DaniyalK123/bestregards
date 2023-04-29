const { DripSequenceJobModel } = require("../../../models/DripSequenceJob");
const { ContactModel } = require("../../../models/Contact");
const { UserModel } = require("../../../models/User");
const { Nylas } = require("../../../nylas");

const getLatestMessageId = (nylasClient, threadId) => {
  return new Promise((resolve, reject) => {
    nylasClient.threads
      .find(threadId)
      .then((thread) => {
        const latestMessageId = thread.messageIds[thread.messageIds.length - 1];
        resolve(latestMessageId);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const executeDripSeqJob = async (dripSeqJob) => {
  console.log("Execute drip sequence job running");

  // within sending hours
  const curTime = new Date();
  const curHour = curTime.getHours();
  if (!dripSeqJob.sendingHours) {
    console.log("Sending Hours missing");
    return;
  }
  if (!dripSeqJob.sendingHours.includes(curHour)) {
    console.log("skipped: not in sending hours");
    return;
  }
  // minimum delay passed
  if (
    dripSeqJob.lastMessageSentTime !== null &&
    (curTime - dripSeqJob.lastMessageSentTime) / 60000 < dripSeqJob.minimumDelay
  ) {
    console.log("skipped: minimum delay is not over yet");
    return;
  }

  // get job emails
  const emailsToSend = dripSeqJob.emailsToSend;
  // retrieve user
  const user = await UserModel.findById(dripSeqJob.user).exec();

  if (!user || !user.nylasEmail || !user.nylasEmail.accessToken) {
    console.log("User or nylas email not found");
    return;
  }
  // create Nylas client
  const nylasClient = Nylas.with(user.nylasEmail.accessToken);
  const latestMessageId = await getLatestMessageId(
    nylasClient,
    dripSeqJob.nylasThreadId
  );
  console.log("latest message ID", latestMessageId);

  // send email
  const curIndex = dripSeqJob.lastMessageSentIndex + 1;
  console.log("sending email:", curIndex);
  const contact = await ContactModel.findById(
    emailsToSend[curIndex].contact
  ).exec();
  try {
    await sendEmail(
      nylasClient,
      dripSeqJob,
      emailsToSend[curIndex].subject,
      emailsToSend[curIndex].body,
      emailsToSend[curIndex].recipient,
      contact.firstName + " " + contact.surName,
      2000,
      curIndex,
      curTime,
      latestMessageId
    );
  } catch (err) {
    console.log(err);
  }
  return 1;
};

const sendEmail = (
  nylasClient,
  dripSeqJob,
  subject,
  body,
  recipientEmail,
  recipientName,
  delay,
  curIndex,
  curTime,
  replyToMessageId
) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => {
      // send email with Nylas
      const to = [{ email: recipientEmail, name: recipientName }];
      const draft = nylasClient.drafts.build({
        subject,
        to,
        body,
        replyToMessageId,
      });

      draft
        .send()
        .then(async (message) => {
          console.log(`${message.id} was sent`);
          dripSeqJob.lastMessageSentIndex = curIndex;
          dripSeqJob.lastMessageSentTime = curTime;
          dripSeqJob.sentEmails += 1;
          if (dripSeqJob.sentEmails === dripSeqJob.totalEmails) {
            dripSeqJob.status = "completed";
          }
          await dripSeqJob.save();
          resolve(message);
        })
        .catch((err) => {
          reject(err);
        });
    }, delay);
  });
};

module.exports = { executeDripSeqJob };
