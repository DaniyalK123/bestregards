require("dotenv").config();
const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { userById } = require("./routes/auth/middleware");
const { authRouter } = require("./routes/auth");
const { sequenceRouter } = require("./routes/sequences");
const { contactRouter } = require("./routes/contacts");
const { templateRouter } = require("./routes/templates");
const { userRouter } = require("./routes/user");
const { threadRouter } = require("./routes/threads");
const cors = require("cors");
const { dripSequenceRouter } = require("./routes/jobs/dripsequence");
const { bulkjobRouter } = require("./routes/jobs/bulk");
const { jobRouter } = require("./routes/jobs");
const { scheduleJobs } = require("./controllers/jobs/dripsequence/schedule");

// initiate DB connection
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
if (DB_USER || DB_PASSWORD) {
  url = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}${
    DB_PORT ? `:${DB_PORT}` : ""
  }/${DB_NAME}?ssl=true&retryWrites=true&w=majority`;
  console.log(url);
} else {
  url = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

mongoose.connect(url, { useNewUrlParser: true }, function (err) {
  if (err) throw err;
  console.log("Connected to mongo");
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

// parse application/json
app.use(bodyParser.json({ limit: "50mb" }));

app.use(cors());

app.use(authRouter);
app.get("/status", (req, res) => res.json("api is working"));
app.use("/api", userRouter);
app.use("/api", threadRouter);
app.use("/api", sequenceRouter);
app.use("/api", templateRouter);
app.use("/api", contactRouter);
app.use("/api", dripSequenceRouter);
app.use("/api", bulkjobRouter);
app.use("/api", jobRouter);
scheduleJobs();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
app.listen(PORT);
