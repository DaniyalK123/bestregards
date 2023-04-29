import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Truncate from "react-truncate";
import { renderDate } from "./utilities";
import OpacityIcon from "@material-ui/icons/Opacity";
import PauseIcon from "@material-ui/icons/Pause";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles((theme) => {
  return {
    threadContainer: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      height: 65,
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#d3d3d3",
      },
    },
  };
});

export default function Thread({ thread, openStartDialog, openStatusDialog }) {
  const classes = useStyles();
  return (
    <div
      className={classes.threadContainer}
      onClick={() => {
        if (thread.status === "running" || thread.status === "paused") {
          openStatusDialog(thread);
        } else {
          openStartDialog(thread);
        }
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          wordWrap: "break-word",
        }}
      >
        {thread.status === "running" && <OpacityIcon color="primary" />}
        {thread.status === "paused" && <PauseIcon color="secondary" />}
        {thread.status === "completed" && <CheckCircleIcon color="secondary" />}
        <Truncate lines={1}>
          {thread.participants[thread.participants.length - 1].name}
        </Truncate>
      </div>
      <div style={{ flex: 2 }}>
        <Truncate lines={1}>{thread.subject}</Truncate>
      </div>
      <div style={{ flex: 4 }}>
        <Truncate lines={1}>{thread.snippet}</Truncate>
      </div>
      <div style={{ flex: 1, maxWidth: 50 }}>{renderDate(thread.date)}</div>
    </div>
  );
}
