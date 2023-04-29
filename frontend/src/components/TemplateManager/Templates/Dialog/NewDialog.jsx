import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React from "react";
import useSnackbar from "../../../../hooks/useSnackbar";

export default function NewDialog(props) {
    const showSnackbar = useSnackbar();
    const addIfInputNotNull = () => {
        if (props.inputValue) {
            props.add(props.inputValue);
            props.handleClose();
        }
        else {
            showSnackbar("Please enter "+props.dialogLabel+" !","error");
        }
    };

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.dialogTitle}</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label={props.dialogLabel}
                type="text"
                fullWidth
                value={props.inputValue}
                onChange={props.handleChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={addIfInputNotNull} color="primary">
                Save
            </Button>
        </DialogActions>
    </Dialog>);
}
