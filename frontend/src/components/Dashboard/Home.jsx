import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Chart from "./Chart";
import JobStatsCard from "./JobStatsCard";
import Jobs from "./Jobs";
import clsx from "clsx";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Home() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [dates, setDates] = useState([]);
  const [bulkJobSentMessages, setBulkJobSentMessages] = useState(0);
  const [dripSequenceSentMessages, setDripSequenceSentMessages] = useState(0);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get("/api/jobs?lastWeek=true").then((res) => {
      setJobs(res.data.jobs);
      console.log("GOT dashboard response", res.data);
      const jobDates = res.data.jobs.map((j) => j.date);
      setDates(jobDates);

      let bulkJobMessages = 0;
      let dripSequenceMessages = 0;

      res.data.jobs.forEach((job) => {
        if (job.type === "bulk") {
          bulkJobMessages += job.sentEmails;
        } else {
          dripSequenceMessages += job.sentEmails;
        }
      });
      console.log("total bulk messages", bulkJobMessages);
      console.log("total drip messages", dripSequenceMessages);
      setBulkJobSentMessages(bulkJobMessages);
      setDripSequenceSentMessages(dripSequenceMessages);
    });
  }, []);
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Chart dates={dates} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <JobStatsCard
              dripSequenceSentMessages={dripSequenceSentMessages}
              bulkJobSentMessages={bulkJobSentMessages}
            />
          </Paper>
        </Grid>
        {/* Recent Jobs */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Jobs jobs={jobs} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
