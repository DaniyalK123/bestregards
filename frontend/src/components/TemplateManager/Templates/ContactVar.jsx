import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '80%',
    margin: 'auto',
    // maxWidth: 360,
    maxHeight: 180,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
  custom: {
    color: 'red',
  },
}));

export default function ContactVar(props) {
  const classes = useStyles();
  const vars = props.contactVariables.concat(props.customVariables);
  return (
      <List className={classes.root}>
        {[...Array(vars.length).keys()].map((value) => {
          const labelId = `checkbox-list-label-${value}`;
          return (
              <ListItem key={value} role={undefined} >
                <ListItemText id={labelId}
                              primary={vars[value]}
                              className={props.customVariables.includes(vars[value]) ? classes.custom : null}/>
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="comments">
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
          );
        })}
      </List>
  );
}
