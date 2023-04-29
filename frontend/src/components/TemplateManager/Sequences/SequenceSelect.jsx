import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";

/**
 * This component is the first row of the sequences tab under template manager
 * It can be used to select an existing sequence or to start creating a new one.
 */

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SequenceSelect({
  isAddingNewSequence,
  setIsAddingNewSequence,
  sequences,
  setSelectedSequenceId,
  setSelectedSequenceName,
  newSequenceName,
  setNewSequenceName,
}) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <>
      {!isAddingNewSequence && (
        <div class={classes.container}>
          <div>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Load Sequence
              </InputLabel>
              <Select
                style={{ padding: 0 }}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                onChange={(e) => {
                  console.log("setting sequence id", e.target.value);
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
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => {
                setIsAddingNewSequence(true);
                setSelectedSequenceId(null);
                setSelectedSequenceName("");
              }}
            >
              <AddIcon />
            </Fab>
          </div>
        </div>
      )}

      {isAddingNewSequence && (
        <div>
          <TextField
            id="outlined-basic"
            label="Sequence Name"
            variant="outlined"
            autoComplete="off"
            value={newSequenceName}
            onChange={(e) => {
              setNewSequenceName(e.target.value);
            }}
          />
          <IconButton
            style={{
              color: theme.palette.error.main,
            }}
            aria-label="delete"
            onClick={() => setIsAddingNewSequence(false)}
          >
            <CancelIcon />
          </IconButton>
        </div>
      )}
    </>
  );
}
