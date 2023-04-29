const { BulkjobModel } = require("../../../models/Bulkjob");
const { ContactModel } = require("../../../models/Contact");
const { UserModel } = require("../../../models/User");
const { Nylas } = require("../../../nylas");
const { userById } = require("../../../routes/auth/middleware");

const executeBulkJob = async (bulkJobId) => {
  console.log("Execute bulk job running");
  // retrieve the job from DB
  const bulkJob = await BulkjobModel.findById(bulkJobId).exec();
  // get job emails
  const emailsToSend = bulkJob.emailsToSend;
  // retrieve user
  const user = await UserModel.findById(bulkJob.user).exec();

  if (!user || !user.nylasEmail || !user.nylasEmail.accessToken) {
    bulkJob.status = "failed";
    await bulkJob.save();
    console.log("User or nylas email not found");
    return;
  }
  // create Nylas client
  const nylasClient = Nylas.with(user.nylasEmail.accessToken);
  // for each email, create and send email
  for (let i = 0; i < emailsToSend.length; i++) {
    console.log("sending email:", i + 1);
    const contact = await ContactModel.findById(emailsToSend[i].contact).exec();
    try {
      await sendEmail(
        nylasClient,
        bulkJobId,
        emailsToSend[i].subject,
        emailsToSend[i].body,
        emailsToSend[i].recipient,
        contact.firstName + " " + contact.surName,
        2000
      );
    } catch (err) {
      console.log(err);
    }
  }
};

const sendEmail = (
  nylasClient,
  jobId,
  subject,
  body,
  recipientEmail,
  recipientName,
  delay
) => {
  return new Promise(async (resolve, reject) => {
    const bulkJob = await BulkjobModel.findById(jobId).exec();
    setTimeout(() => {
      // send email with Nylas
      const to = [{ email: recipientEmail, name: recipientName }];
      const draft = nylasClient.drafts.build({
        subject,
        to,
        body,
      });

      draft
        .send()
        .then(async (message) => {
          console.log(`${message.id} was sent`);
          console.log(bulkJob);
          bulkJob.sentEmails = bulkJob.sentEmails + 1;
          console.log("sent emails", bulkJob.sentEmails);
          console.log("total emails", bulkJob.totalEmails);
          if (bulkJob.sentEmails === bulkJob.totalEmails) {
            console.log("job completed");
            bulkJob.status = "completed";
          }
          await bulkJob.save();
          resolve(message);
        })
        .catch((err) => {
          reject(err);
        });
    }, delay);
  });
};

module.exports = { executeBulkJob };
