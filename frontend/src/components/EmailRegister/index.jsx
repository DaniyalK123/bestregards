import React, { useState, useEffect, useContext } from "react";
import Button from "@material-ui/core/Button";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import useSnackbar from "../../hooks/useSnackbar";

const useStyles = makeStyles((theme) => {
  return {
    icon: {
      fontSize: "120%",
      transform: "translateY(20%)",
    },
    loader: {
      marginTop: 24,
    },
    disconnectButton: {
      backgroundColor: theme.palette.error.main,
      color: "#FFF",
      "&:hover": {
        background: theme.palette.error.dark,
      },
      marginTop: 24,
    },
    registerButton: {
      marginTop: 24,
    },
    center: {
      width: "fit-content",
      margin: "auto",
    },
  };
});

const RegisterPrompt = () => {
  const showSnackbar = useSnackbar();
  const classes = useStyles();
  const [initializingAuth, setInitializingAuth] = useState(false);
  const initNylasAuth = () => {
    setInitializingAuth(true);
    axios
      .get("/api/nylas/auth")
      .then((res) => {
        window.open(res.data.authUrl, "_self");
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Could not initiate authorization", "error");
      })
      .finally(() => {
        setInitializingAuth(false);
      });
  };
  return (
    <div className={classes.center}>
      <h1 className={classes.center}>
        <CancelIcon color="error" className={classes.icon} />
        Email is not registered
      </h1>
      <div className={classes.center}>
        {!initializingAuth && (
          <Button
            className={classes.registerButton}
            onClick={initNylasAuth}
            color="primary"
            variant="contained"
          >
            Register Email
          </Button>
        )}
        {initializingAuth && <CircularProgress />}
      </div>
    </div>
  );
};

const ShowEmailInfo = ({
  registeredEmail,
  setRegisteredEmail,
  setIsEmailRegistered,
}) => {
  const classes = useStyles();
  const showSnackbar = useSnackbar();
  const [disconnecting, setDisconnecting] = useState(false);
  const disconnectEmail = () => {
    setDisconnecting(true);
    axios
      .delete("/api/nylas")
      .then((res) => {
        setRegisteredEmail("");
        setIsEmailRegistered(false);
        showSnackbar("Email disconnected", "success");
      })
      .catch((err) => {
        showSnackbar("Could not disconnect email", "error");
      })
      .finally(() => {
        setDisconnecting(false);
      });
  };
  return (
    <div className={classes.center}>
      <h1 className={classes.center}>
        <CheckCircleIcon color="primary" className={classes.icon} />
        Email Registered
      </h1>
      <h3 className={classes.center}> {registeredEmail} </h3>
      <div className={classes.center}>
        {!disconnecting && (
          <Button
            className={classes.disconnectButton}
            color="#FFF"
            variant="contained"
            onClick={disconnectEmail}
          >
            Disconnect Email
          </Button>
        )}
        {disconnecting && <CircularProgress className={classes.loader} />}
      </div>
    </div>
  );
};

export default function EmailRegister() {
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isEmailRegistered, setIsEmailRegistered] = useState(false);
  const auth = useContext(AuthContext);
  const classes = useStyles();
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/nylas`)
      .then((res) => {
        setIsEmailRegistered(true);
        setRegisteredEmail(res.data.registeredEmail);
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.status &&
          err.response.status === 404
        ) {
          console.log("404");
          setIsEmailRegistered(false);
          setRegisteredEmail("");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div>
      {loading && (
        <div className={classes.center}>
          <CircularProgress />
        </div>
      )}
      {!loading && !isEmailRegistered && <RegisterPrompt />}
      {!loading && isEmailRegistered && (
        <ShowEmailInfo
          registeredEmail={registeredEmail}
          setRegisteredEmail={setRegisteredEmail}
          setIsEmailRegistered={setIsEmailRegistered}
        />
      )}
    </div>
  );
}
