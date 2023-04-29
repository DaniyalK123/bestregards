import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function JobStatsCard({
  dripSequenceSentMessages,
  bulkJobSentMessages,
}) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Bulk Emails Sent</Title>
      <Typography component="p" variant="h4">
        {bulkJobSentMessages}
      </Typography>
      <Title>Drip Emails Sent</Title>
      <Typography component="p" variant="h4">
        {dripSequenceSentMessages}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        Since last week
      </Typography>
    </React.Fragment>
  );
}
