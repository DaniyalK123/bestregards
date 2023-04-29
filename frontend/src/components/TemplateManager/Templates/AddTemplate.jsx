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
import Fab from "@material-ui/core/Fab";


export default function AddTemplate(props) {

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

    const handleChange = (event) => {
        props.handleChange(event);
    }

    return (
        <div>
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleClickOpen}
            >
                <AddIcon />
            </Fab>
            <NewDialog
                open={open}
                handleClose={handleClose}
                handleChange={handleChange}
                add={add}
                inputValue={props.inputValue}
                dialogTitle={props.dialogTitle}
                dialogLabel={props.dialogLabel}
            />
        </div>
    );
}
