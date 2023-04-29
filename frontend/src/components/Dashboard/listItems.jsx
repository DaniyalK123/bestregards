import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import PeopleIcon from "@material-ui/icons/People";
import ListIcon from "@material-ui/icons/List";
import CreateIcon from "@material-ui/icons/Create";
import SendIcon from "@material-ui/icons/Send";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => {
  return {
    link: {
      textDecoration: "none",
      color: theme.palette.secondary.main,
    },
  };
});

export const MainListItems = () => {
  const classes = useStyles();
  return (
    <div>
      <Link to="/" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </Link>

      <Link to="/email" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <MailOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Email" />
        </ListItem>
      </Link>

      <Link to="/contacts" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <PeopleIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Contacts" />
        </ListItem>
      </Link>

      <Link to="/templates" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <CreateIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Template Manager" />
        </ListItem>
      </Link>

      <Link to="/bulksend" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <SendIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Bulk Send" />
        </ListItem>
      </Link>

      <Link to="/dripsequences" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <InvertColorsIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Drip Sequences" />
        </ListItem>
      </Link>

      <Link to="/jobs" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <ListIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Jobs" />
        </ListItem>
      </Link>
    </div>
  );
};
