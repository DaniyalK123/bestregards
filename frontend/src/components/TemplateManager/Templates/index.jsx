import React, {useEffect, useState} from "react";
import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import ChooseTemplate from "./ChooseTemplate";
import AddTemplateVariables from "./AddTemplateVariables";
import EditArea from "./EditArea";
import ContactVar from "./ContactVar";
import AddTemplate from "./AddTemplate"

import {templatesData} from "../data";

import useSnackbar from "../../../hooks/useSnackbar";
import SaveIcon from "@material-ui/icons/Save";
import IconButton from "../../common/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import clsx from "clsx";
import theme from "../../../theme";
import axios from "axios";

export default function Templates(props) {

    const useStyles = makeStyles((theme) => ({
        container: {
            backgroundColor: theme.palette.background.paper,
            width: "60%",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
        },
        grid: {padding: "5px", border: "solid 1px", height: "250px"},
        formControl: {
            margin: theme.spacing(1),
            minWidth: 200,
        },
        textField: {
            left: 100,
        },
        but: {"margin-right": "10px"},
        contactVar: {
            'margin-bottom': 5,
            'text-align': 'center',
            'margin-top': 9,
        },
        item: {
            marginTop: 12,
            marginBottom: 12,
        },
        buttonRow: {
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
        },
    }));

    const classes = useStyles();
    const showSnackbar = useSnackbar();

    const [templates, setTemplates] = useState(templatesData);
    const [selectedTemplateVariables, setSelectedTemplateVariables] = useState([]);
    const [selectedContactVariables, setSelectedContactVariables] = useState([]);
    const [selectedCustomVariables, setSelectedCustomVariables] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState('');
    const [preview, setPreview] = React.useState('');
    const [newMessage, setNewMessage] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState();
    const [selectedTemplateName, setSelectedTemplateName] = useState();
    const [loading, setLoading] = useState(false);

    const deleteTemplate = () => {
        setLoading(true);
        axios
            .delete(`/api/templates/${selectedTemplateId}`)
            .then(async (res) => {
                showSnackbar("Template deleted!", "success");
                setSelectedTemplateId(null);
                setSelectedTemplateName("");
                setSelectedTemplateVariables([]);
                setSelectedMessage('');
                await updateTemplateList();
            })
            .catch((err) => {
                console.log(err);
                showSnackbar("An error occured.", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteTempVar = (id) => {
        setSelectedTemplateVariables(selectedTemplateVariables.filter(el => el !== id));
    }

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const addTemplate = (name) => {
        if (!name || name.length === 0) {
            showSnackbar("Please enter a template name.", "error");
            return;
        }
        setLoading(true);
        axios
            .post("/api/templates", {
                name: name,
                message: ''
            })
            .then(async (res) => {
                showSnackbar("Template Created!", "success");
                await updateTemplateList();
                setSelectedTemplateId(res.data);
            })
            .catch((err) => {
                console.log(err);
                showSnackbar("Error - Could not create template.", "error");
            })
            .finally(() => {
                setLoading(false);
                showSnackbar("Template created!", "success");
                setInputValue('');
            });
    }

    const updateTemplate = () => {
        if (!selectedTemplateName || selectedTemplateName.length === 0) {
            showSnackbar("Please enter a template variable name.", "error");
            return;
        }
        console.log(selectedTemplateVariables);

        axios
            .patch(`/api/templates/${selectedTemplateId}`, {
                name: selectedTemplateName,
                templateVariables: selectedTemplateVariables,
                // contactVariables: selectedContactVariables,
                message: newMessage
            })
            .then(async (res) => {
                showSnackbar("Template updated!", "success");
                await updateTemplateList();
            })
            .catch((err) => {
                console.log(err);
                showSnackbar("An error occurred.", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const updateTemplateList = () => {
        return new Promise((resolve, reject) => {
            axios
                .get("/api/templates")
                .then((res) => {
                    setTemplates(res.data.templates);
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    const addTempVar = (name) => {
        if (selectedTemplateVariables.includes(name)) showSnackbar("Template variable already exists", "error");
        else {
            setSelectedTemplateVariables(selectedTemplateVariables.concat(name));
        }
        setInputValue('');
    }

//====================================================================================================

    const FIXED_CONTACT_VARIABLES = ["firstName", "surName", "email", "company"];

    useEffect(() => {
        setLoading(true);
        console.log("SENDING REQUEST");
        const templatesPromise = axios.get("/api/templates");
        const contactsPromise = axios.get("/api/contacts");
        const customVariablesPromise = axios.get("/api/contacts/customVariables");
        Promise.all([templatesPromise, contactsPromise, customVariablesPromise])
            .then((res) => {
                setTemplates(res[0].data.templates);
                setSelectedContactVariables(FIXED_CONTACT_VARIABLES);
                setSelectedCustomVariables(res[2].data.customVariables);
            })
            .catch((err) => {
                console.log(err);
                showSnackbar("Error fetching data from server.", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // fetch data for the selected template
    useEffect(() => {
        if (selectedTemplateId) {
            const selectedTemplate = templates.filter(
                (t) => t._id === selectedTemplateId
            )[0];
            console.log("selected template", selectedTemplate);
            setSelectedTemplateName(selectedTemplate.name);
            setSelectedTemplateVariables(selectedTemplate.templateVariables);
            setSelectedMessage(selectedTemplate.message?selectedTemplate.message:"");
            setPreview(selectedTemplate.message?selectedTemplate.message:"");
        }
    }, [selectedTemplateId]);

//====================================================================================================

    return (
        <div className={classes.container}>

            {loading && <CircularProgress size={100} />}
            {!loading && (

                <Grid container spacing={4}>
                    <Grid item xs={3} style={{alignItems: "center", display: "flex",}}>
                        <ChooseTemplate
                            templates={templates}
                            selectedTemplateId={selectedTemplateId}
                            setSelectedTemplateId={setSelectedTemplateId}
                        />
                        <AddTemplate
                            templates={templates}
                            inputValue={inputValue}
                            delete={() => deleteTemplate()}
                            handleChange={(event) => handleChange(event)}
                            add={(name) => addTemplate(name)}
                            dialogTitle="New Template"
                            dialogLabel="Template Name"
                        />
                    </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={4}>
                        {selectedTemplateId && (
                            <div className={classes.formControl}>
                                <TextField
                                    className={classes.textField}
                                    id="outlined-basic"
                                    label="Index Name"
                                    variant="outlined"
                                    autoComplete="off"
                                    value={selectedTemplateName}
                                    onChange={(e) => {
                                        setSelectedTemplateName(e.target.value);
                                    }}
                                />
                            </div>
                        )}
                    </Grid>
                    {selectedTemplateId && (
                        <Grid item xs={6}>
                            <div className={classes.grid}>
                                <h3 className={classes.contactVar}>Contact Variable</h3>
                                <ContactVar
                                    contactVariables={selectedContactVariables}
                                    customVariables={selectedCustomVariables}
                                />
                            </div>
                        </Grid>)}
                    {selectedTemplateId && (
                        <Grid item xs={6}>
                            <div className={classes.grid}>
                                <AddTemplateVariables
                                    templates={selectedTemplateVariables}
                                    inputValue={inputValue}
                                    delete={(id) => deleteTempVar(id)}
                                    handleChange={(event) => handleChange(event)}
                                    add={(name) => addTempVar(name)}
                                    dialogTitle={'Template Variable'}
                                    dialogLabel={'Variable Name'}
                                    title={'Template Variable'}
                                />
                            </div>
                        </Grid>)}
                    {selectedTemplateId && (
                        <Grid item xs={12}>
                            <EditArea
                                selectedMessage={selectedMessage}
                                setSelectedMessage={setNewMessage}
                                value={preview}
                                setValue={setPreview}
                                contactVariables={selectedContactVariables}
                                customVariables={selectedCustomVariables}
                                templateVariables={selectedTemplateVariables}
                            />
                        </Grid>
                    )}
                    {selectedTemplateId && (
                        <Grid item xs={12} >
                            <div className={clsx(classes.item, classes.buttonRow)}>
                                <IconButton
                                    ButtonIcon={SaveIcon}
                                    label="Save"
                                    color={theme.palette.secondary.main}
                                    onClick={() => updateTemplate()}
                                />
                                <IconButton
                                    ButtonIcon={DeleteForeverIcon}
                                    label="Delete"
                                    color={theme.palette.error.main}
                                    onClick={() => deleteTemplate()}
                                />
                            </div>
                        </Grid>
                    )}
                </Grid>)}
        </div>
    );
}
