import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 200,
  },
}));

function SelectTemplate({
  templates,
  setSelectedTemplateId,
  selectedTemplateId,
}) {
  const classes = useStyles();
  /////////////

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">
          Select Template
        </InputLabel>
        <Select
          style={{ padding: 0 }}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          onChange={(e) => {
            setSelectedTemplateId(e.target.value);
          }}
          value={selectedTemplateId}
          label="Template"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {templates.map((t) => (
            <MenuItem value={t._id}>{t.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default SelectTemplate;
