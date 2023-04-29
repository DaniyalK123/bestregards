import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@material-ui/core";
import useSnackbar from "../../hooks/useSnackbar";
import axios from "axios";

const useStyles = makeStyles((theme) => {
  return {
    dialogArea: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    selectDropdown: {
      minWidth: 200,
      marginBottom: 12,
    },
    variableValuesContainer: {
      border: `1px solid ${theme.palette.primary.main}`,
      minWidth: "70%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
      marginBottom: 24,
      paddingBottom: 24,
    },
    textField: {
      minWidth: 150,
      marginRight: 12,
    },

    hourInput: {
      width: 100,
      margin: 16,
    },

    startButton: {
      marginBottom: 8,
    },

    marginBottom: {
      marginBottom: 16,
    },
  };
});

export default function StartSequence({
  thread,
  sequences,
  contacts,
  open,
  handleClose,
  refreshList,
}) {
  const [sequenceName, setSequenceName] = useState("");
  const [selectedSequenceId, setSelectedSequenceId] = useState("");
  const [selectedContactId, setSelectedContactId] = useState("");
  const [templateVariables, setTemplateVariables] = useState([]);
  const [templateVariableValues, setTemplateVariableValues] = useState([]);
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(23);
  const [notify, setNotify] = useState(false);
  const [minDelay, setMinDelay] = useState(180);
  const [submitting, setSubmitting] = useState(false);
  const showSnackbar = useSnackbar();

  const submit = () => {
    setSubmitting(true);
    if (!sequenceName) {
      showSnackbar("Please enter a name", "error");
      setSubmitting(false);
      return;
    }
    if (!selectedContactId || !selectedSequenceId) {
      showSnackbar("Please select a sequence and contact", "error");
      setSubmitting(false);
      return;
    }
    if (minDelay < 0) {
      showSnackbar("Minimum delay must be non-negative");
      setSubmitting(false);
      return;
    }

    let allVariableValuesSpecified = true;
    templateVariableValues.forEach((value) => {
      if (!value) {
        showSnackbar("Please enter all variable values", "error");
        setSubmitting(false);
        allVariableValuesSpecified = false;
      }
    });
    if (!allVariableValuesSpecified) {
      return;
    }

    const data = {
      name: sequenceName,
      minimumDelay: minDelay,
      sequence: selectedSequenceId,
      contact: selectedContactId,
      threadId: thread.id,
      subject: thread.subject,
      templateVariables,
      templateVariableValues,
      startHour,
      endHour,
    };
    console.log("POSTING", data);

    axios
      .post("/api/dripSequences", data)
      .then((res) => {
        showSnackbar("Drip sequence started!");
        setTemplateVariableValues([]);
        setTemplateVariables([]);
        setSelectedContactId("");
        setSelectedSequenceId("");
        refreshList();
        setTimeout(() => handleClose(), 1000);
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.check
        ) {
          console.log(err.response.data.check);
          showSnackbar(
            `Contact ${err.response.data.check.contact} does not have the variable ${err.response.data.check.variable}`,
            "error"
          );
        } else {
          showSnackbar("An error occured", "error");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const updateTemplateVariableValue = (newValue, index) => {
    setTemplateVariableValues(
      templateVariableValues.map((val, i) => {
        if (i !== index) {
          return val;
        } else {
          return newValue;
        }
      })
    );
  };

  useEffect(() => {
    const variables = [];
    if (selectedSequenceId) {
      const selectedSequence = sequences.filter(
        (s) => s._id === selectedSequenceId
      )[0];
      if (
        selectedSequence.templates &&
        selectedSequence.templates.length &&
        selectedSequence.templates.length > 0
      ) {
        for (let i = 0; i < selectedSequence.templates.length; i++) {
          const template = selectedSequence.templates[i];
          if (
            template.templateVariables &&
            template.templateVariables.length &&
            template.templateVariables.length > 0
          ) {
            for (let j = 0; j < template.templateVariables.length; j++) {
              variables.push(template.templateVariables[j]);
            }
          }
        }
        setTemplateVariables(variables);

        const variableValues = [];
        variables.forEach((_) => {
          variableValues.push("");
        });
        setTemplateVariableValues(variableValues);
      }
    } else {
      return;
    }
  }, [selectedSequenceId]);

  const classes = useStyles();
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogContent className={classes.dialogArea}>
        <DialogTitle>Start Drip Sequence</DialogTitle>
        <TextField
          label="Name"
          value={sequenceName}
          onChange={(e) => setSequenceName(e.target.value)}
          className={classes.marginBottom}
        />
        <div>
          <FormControl variant="outlined" className={classes.selectDropdown}>
            <InputLabel id="demo-simple-select-outlined-label">
              Select Sequence
            </InputLabel>
            <Select
              style={{ padding: 0 }}
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              onChange={(e) => {
                setSelectedSequenceId(e.target.value);
              }}
              label="Sequence"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {sequences.map((s) => (
                <MenuItem value={s._id}>{s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl variant="outlined" className={classes.selectDropdown}>
            <InputLabel id="demo-simple-select-outlined-label">
              Select Contact
            </InputLabel>
            <Select
              style={{ padding: 0 }}
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              onChange={(e) => {
                setSelectedContactId(e.target.value);
              }}
              label="Contact"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {contacts.map((c) => (
                <MenuItem value={c._id}>
                  {c.firstName + " " + c.surName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={classes.variableValuesContainer}>
          <div>
            <h2>Variable Values</h2>
          </div>
          {templateVariables && templateVariables.length > 0 && (
            <>
              {templateVariables.map((templateVariable, index) => (
                <div>
                  <TextField
                    className={classes.textField}
                    variant="outlined"
                    label={templateVariable}
                    disabled
                  />
                  <TextField
                    className={classes.textField}
                    variant="outlined"
                    label="Enter Value"
                    value={templateVariableValues[index]}
                    onChange={(e) =>
                      updateTemplateVariableValue(e.target.value, index)
                    }
                  />
                </div>
              ))}
            </>
          )}
          {!templateVariables ||
            (templateVariables.length === 0 && (
              <h3>Sequence has no template variables</h3>
            ))}
        </div>
        <div>
          <TextField
            className={classes.hourInput}
            type="number"
            label="Start Hour"
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
            InputProps={{ inputProps: { min: 0, max: 23 } }}
          />
          <TextField
            className={classes.hourInput}
            type="number"
            label="End Hour"
            value={endHour}
            onChange={(e) => setEndHour(e.target.value)}
            InputProps={{ inputProps: { min: startHour, max: 23 } }}
          />
        </div>

        <TextField
          type="number"
          inputProps={{ min: 0 }}
          value={minDelay}
          onChange={(e) => setMinDelay(e.target.value)}
          label="Minimum delay (minutes)"
          className={classes.marginBottom}
          helperText={"Minimum gap between emails"}
        />
        <div>
          {!submitting && (
            <Button
              className={classes.startButton}
              variant="contained"
              color="primary"
              onClick={submit}
            >
              {" "}
              Start{" "}
            </Button>
          )}
          {submitting && <CircularProgress />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
