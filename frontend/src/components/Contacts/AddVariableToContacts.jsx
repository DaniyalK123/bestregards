import {
  DialogTitle,
  Dialog,
  TextField,
  makeStyles,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";
import axios from "axios";
import useSnackbar from "../../hooks/useSnackbar";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  dialogHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  dialog: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
  },
  textField: {
    marginTop: 8,
  },
  button: {
    marginBottom: 16,
    marginRight: 16,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 500,
    minHeight: 500,
  },
}));

export default function AddVariableToContacts({
  open,
  onClose,
  refreshContacts,
}) {
  const classes = useStyles();
  const [variableName, setVariableName] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const showSnackbar = useSnackbar();

  const createVariable = () => {
    setSubmitting(true);
    if (!variableName || !defaultValue) {
      showSnackbar("Please enter a name and default value", "error");
      return;
    }
    if (!Boolean(variableName.match(/^[A-Z]+$/i))) {
      showSnackbar("Variable name must contain alphabets only.", "error");
      return;
    }
    axios
      .post("/api/contacts/customVariables", { variableName, defaultValue })
      .then(() => {
        showSnackbar("Variable added!");
        setVariableName("");
        setDefaultValue("");
        refreshContacts();
        onClose();
      })
      .catch(() => {
        showSnackbar("An error occured", "error");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <Dialog onClose={onClose} open={open} maxWidth={"sm"}>
        {!submitting && (
          <div
            style={{ minWidth: 500, minHeight: 500 }}
            className={classes.dialog}
          >
            <div className={classes.dialogHeader}>
              <DialogTitle className={classes.title}>Add Variable</DialogTitle>
            </div>

            <TextField
              variant="outlined"
              label="Variable Name"
              value={variableName}
              onChange={(e) => setVariableName(e.target.value)}
              className={classes.textField}
            />
            <TextField
              variant="outlined"
              label="Default Value"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              className={classes.textField}
            />

            <div>
              <Button
                variant="contained"
                onClick={onClose}
                className={classes.button}
              >
                Cancel
              </Button>
              <Button
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={createVariable}
              >
                Create
              </Button>
            </div>
          </div>
        )}
        {submitting && (
          <div className={classes.center}>
            <CircularProgress size={100} />
          </div>
        )}
      </Dialog>
    </>
  );
}
