import React, {useState} from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import {ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import NewDialog from "./Dialog/NewDialog";
import {makeStyles} from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";


export default function AddTemplateVariables(props) {

    const useStyles = makeStyles((theme) => ({
        title: {
            'margin-top': 5,
            'margin-bottom': 0,
            'text-align': 'center',
        },
        but: {
            'bottom': 2,
            'min-width': 36,
        },
        list: {
            width: '80%',
            margin: 'auto',
            overflow: 'auto',
            maxHeight: 180,
            backgroundColor: theme.palette.background.paper,
        },
    }));

    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const add = (name) => {
        props.add(name);
    }

    const deleteTemplate = (id) => {
        props.delete(id);
    }

    const handleChange = (event) => {
        props.handleChange(event);
    }

    const templateList = props.templates.map(
        (cur, index) => {

            return (
                <ListItem key={index}>
                    <ListItemText
                        primary={cur}
                        // secondary={secondary ? 'Secondary text' : null}
                    />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon onClick={deleteTemplate.bind(this, cur)}/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        }
    );

    return (
        <div>
            <h3 className={classes.title}>{props.title} <Button className={classes.but} onClick={handleClickOpen}><AddCircleIcon/></Button></h3>
            <NewDialog
                open={open}
                handleClose={handleClose}
                handleChange={handleChange}
                add={add}
                inputValue={props.inputValue}
                dialogTitle={props.dialogTitle}
                dialogLabel={props.dialogLabel}
            />
            <List className={classes.list}>
                {templateList}
            </List>
        </div>
    );
}
