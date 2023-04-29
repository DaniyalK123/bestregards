import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Button,
} from "@material-ui/core";
import useSnackbar from "../../hooks/useSnackbar";

const useStyles = makeStyles((theme) => {
  return {
    dialogArea: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    deleteButton: {
      backgroundColor: theme.palette.error.main,
      marginLeft: 16,
      color: "white",
    },
    pauseButton: {
      color: "white",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-around",
    },
  };
});

export default function SequenceStatus({
  open,
  handleClose,
  thread,
  refreshList,
}) {
  const [jobData, setJobData] = useState({});
  const [loading, setLoading] = useState(false);
  const showSnackbar = useSnackbar();
  const classes = useStyles();

  useEffect(() => {
    if (thread && thread.dripSequenceId) {
      setLoading(true);
      axios
        .get(`/api/dripSequences/${thread.dripSequenceId}`)
        .then((res) => {
          setJobData(res.data.dripSequenceJob);
        })
        .finally(() => setLoading(false));
    }
  }, [thread]);

  const deleteSequence = () => {
    setLoading(true);
    axios
      .delete(`/api/dripSequences/${thread.dripSequenceId}`)
      .then(() => {
        showSnackbar("Sequence deleted");
        refreshList();
        setTimeout(() => handleClose(), 1000);
      })
      .catch(() => {
        showSnackbar("An error occured", "error");
      })
      .finally(() => setLoading(false));
  };

  const updateSequenceStatus = (status) => {
    setLoading(true);
    axios
      .patch(`/api/dripSequences/${thread.dripSequenceId}`, {
        status,
      })
      .then(() => {
        showSnackbar(
          status === "paused" ? "Sequence paused." : "Sequence resumed."
        );
        refreshList();
        setTimeout(() => handleClose(), 1000);
      })
      .catch(() => {
        showSnackbar("An error occured", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogContent className={classes.dialogArea}>
        <DialogTitle>{jobData.name}</DialogTitle>
        {loading && <CircularProgress />}
        {!loading && (
          <div>
            <div>
              <h2>
                Progress: {jobData.sentEmails}/{jobData.totalEmails}
              </h2>
            </div>
            <div>
              <h2>Messages</h2>
              {jobData &&
                jobData.emailsToSend &&
                jobData.emailsToSend
                  .filter((email) => email.status === "pending")
                  .map((email) => {
                    return (
                      <>
                        <h4>{ReactHtmlParser(email.body)}</h4>
                        <div style={{ textAlign: "center", width: "100%" }}>
                          ------------
                        </div>
                      </>
                    );
                  })}
            </div>
            <div className={classes.buttonContainer}>
              <div>
                {jobData.status !== "completed" && (
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.pauseButton}
                    onClick={() =>
                      updateSequenceStatus(
                        jobData.status === "paused" ? "running" : "paused"
                      )
                    }
                  >
                    {jobData.status === "paused" ? "Resume" : "Pause"}
                  </Button>
                )}
                <Button
                  onClick={deleteSequence}
                  variant="contained"
                  className={classes.deleteButton}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
