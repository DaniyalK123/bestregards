import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import ReactHtmlParser from "react-html-parser";

const useStyles = makeStyles((theme) => ({
  previewHeadingContainer: {
    width: "100%",
    textAlign: "center",
  },
  previewHeading: {
    color: theme.palette.primary.main,
  },
}));

export default function Preview({ selectedSequenceTemplates }) {
  const classes = useStyles();
  return (
    <div>
      <div class={classes.previewHeadingContainer}>
        <h1 class={classes.previewHeading}>Preview</h1>
      </div>
      <Paper style={{ padding: 36, minWidth: 500 }} elevation={3}>
        {selectedSequenceTemplates.map((t, i) => {
          return (
            <>
              <h2>{`${i + 1}. ${t.name}`}</h2>
              <p>{ReactHtmlParser(t.message)}</p>
            </>
          );
        })}
      </Paper>
    </div>
  );
}
