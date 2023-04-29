import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core/styles";

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
}));



export default function ChooseTemplate(props) {
    const classes = useStyles();

    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                    Load Template
                </InputLabel>
                <Select
                    style={{ padding: 0 }}
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={props.selectedTemplateId}
                    onChange={(e) => {
                        console.log("setting template id", e.target.value);
                        props.setSelectedTemplateId(e.target.value);
                    }}
                    label="Template"
                >
                    <MenuItem value="" style={{ 'min-width': 100 }}>
                        <em>None</em>
                    </MenuItem>
                    {props.templates.map((s) => (
                        <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
