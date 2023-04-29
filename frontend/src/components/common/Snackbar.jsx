import React, { useContext } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import { SnackbarContext } from "../../contexts/SnackbarContext";
/**
 * Common snackbar component that will be mounted at the top level of the app.
 * Can be easily shown using the useSnackbar hook
 */

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function GlobalSnackbar() {
  const classes = useStyles();
  const snackbarContext = useContext(SnackbarContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    snackbarContext.setIsOpen(false);
  };
  return (
    <div className={classes.root}>
      <Snackbar
        open={snackbarContext.isOpen}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={snackbarContext.severity}>
          {snackbarContext.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
