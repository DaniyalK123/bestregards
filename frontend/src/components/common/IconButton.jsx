import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  button: {
    display: "block",
  },
  buttonIcon: {
    fontSize: "400%",
  },
}));
export default function IconButton({ ButtonIcon, label, color, onClick }) {
  const classes = useStyles();
  return (
    <Button
      style={{ color: color }}
      className={classes.button}
      color={color}
      onClick={onClick}
    >
      <ButtonIcon className={classes.buttonIcon} />
      <div>{label}</div>
    </Button>
  );
}
