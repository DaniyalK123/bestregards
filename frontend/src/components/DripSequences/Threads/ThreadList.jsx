import React, { useState, useEffect } from "react";
import Thread from "./Thread";
import Paper from "@material-ui/core/Paper";
import useSnackbar from "../../../hooks/useSnackbar";
import Divider from "@material-ui/core/Divider";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import StartSequence from "../StartSequence";
import SequenceStatus from "../SequenceStatus";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import MailIcon from "@material-ui/icons/Mail";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "../../common/IconButton";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";

const useStyles = makeStyles((theme) => {
  return {
    threadListItem: {
      width: "100%",
    },
    paginationButtonsContainer: {
      display: "flex",
      justifyContent: "space-evenly",
    },
    center: {
      width: "100%",
      textAlign: "center",
    },
    loader: {
      fontSize: "200%",
      margin: "auto",
    },
  };
});

export default function ThreadList() {
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [emailRegistered, setEmailRegistered] = useState(true);
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState(false);
  const [sequences, setSequences] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [refreshId, setRefreshId] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [selectedBox, setSelectedBox] = useState("inbox");
  const showSnackbar = useSnackbar();
  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    const sequencesPromise = axios.get("/api/sequences");
    const contactsPromise = axios.get("/api/contacts");
    Promise.all([sequencesPromise, contactsPromise]).then((res) => {
      console.log("setting sequences", res[0].data.sequences);
      console.log("setting contacts", res[1].data.contacts);
      setSequences(res[0].data.sequences);
      setContacts(res[1].data.contacts);
    });
  }, []);

  const openStartDialog = (thread) => {
    setSelectedThread(thread);
    setIsStartDialogOpen(true);
  };

  const openStatusDialog = (thread) => {
    setSelectedThread(thread);
    setIsStatusDialogOpen(true);
  };

  const closeStartDialog = () => {
    setIsStartDialogOpen(false);
    setSelectedThread(null);
  };

  const closeStatusDialog = () => {
    setIsStatusDialogOpen(false);
    setSelectedThread(null);
  };

  const refreshList = () => {
    setRefreshId((rid) => rid + 1);
  };

  const searchThreads = () => {
    setLoading(true);
    axios
      .get("/api/threads", { params: { search: searchTerm } })
      .then((res) => {
        if (!res.data.emailRegistered) {
          setEmailRegistered(false);
          return;
        }
        setThreads(res.data.threads);
        setHasNextPage(res.data.hasNext);
        setIsSearching(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isSearching) {
      setLoading(true);
      axios
        .get(`/api/threads?page=${page}&box=${selectedBox}`)
        .then((res) => {
          if (!res.data.emailRegistered) {
            setEmailRegistered(false);
            return;
          }
          setThreads(res.data.threads);
          setHasNextPage(res.data.hasNext);
        })
        .catch((err) => {
          showSnackbar("Could not load threads", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [page, refreshId, selectedBox, isSearching]);
  return (
    <>
      {loading && (
        <div className={classes.center}>
          <CircularProgress size={100} />
        </div>
      )}
      {!loading && !emailRegistered && (
        <div className={classes.center}>
          <h1>No email registered</h1>
          <h2>
            Click <Link to="/email">here</Link> to register your email
          </h2>
        </div>
      )}
      {!loading && emailRegistered && threads && threads.length > 0 && (
        <div>
          <div className={classes.center}>
            <h1>Threads</h1>
            <TextField
              variant="outlined"
              style={{ minWidth: 250 }}
              label="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  searchThreads();
                }
              }}
            />
            <CancelIcon
              color="error"
              size={100}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setIsSearching(false);
                setSearchTerm("");
              }}
            />
            <div style={{ marginTop: 8 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={searchThreads}
              >
                Search
              </Button>
            </div>
          </div>

          {!isSearching && (
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <div>
                <IconButton
                  ButtonIcon={MailIcon}
                  label="Inbox"
                  color={
                    selectedBox === "inbox"
                      ? theme.palette.primary.main
                      : "#000"
                  }
                  onClick={() => {
                    if (selectedBox === "sent") setSelectedBox("inbox");
                  }}
                />
              </div>
              <div>
                <IconButton
                  ButtonIcon={SendIcon}
                  label="Sent"
                  color={
                    selectedBox === "sent" ? theme.palette.primary.main : "#000"
                  }
                  onClick={() => {
                    if (selectedBox === "inbox") setSelectedBox("sent");
                  }}
                />
              </div>
            </div>
          )}
          <StartSequence
            open={isStartDialogOpen}
            handleClose={closeStartDialog}
            sequences={sequences}
            contacts={contacts}
            thread={selectedThread}
            refreshList={refreshList}
          />
          <SequenceStatus
            thread={selectedThread}
            open={isStatusDialogOpen}
            handleClose={closeStatusDialog}
            refreshList={refreshList}
          />
          <Paper>
            {threads.map((t) => (
              <div key={t.id}>
                <Thread
                  thread={t}
                  openStartDialog={openStartDialog}
                  openStatusDialog={openStatusDialog}
                />
                <Divider />
              </div>
            ))}
          </Paper>

          <div className={classes.paginationButtonsContainer}>
            {page > 2 && <FirstPageIcon onClick={() => setPage(1)} />}
            {page > 1 && (
              <NavigateNextIcon
                onClick={() => setPage((p) => (p > 1 ? p - 1 : p))}
              />
            )}

            {hasNextPage && (
              <NavigateBeforeIcon
                onClick={() => setPage((p) => (hasNextPage ? p + 1 : p))}
              />
            )}
          </div>
        </div>
      )}
      {!loading && emailRegistered && threads && threads.length === 0 && (
        <>
          <h1>No emails threads found.</h1>
          <h1> Note: It can take up to 24 hours to sync your mails!</h1>
        </>
      )}
    </>
  );
}
