import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  TextField,
  Container,
  Button,
  makeStyles,
  Avatar,
  CircularProgress,
} from "@material-ui/core";
import useSnackbar from "../../hooks/useSnackbar";
import axios from "axios";
import ClearIcon from "@material-ui/icons/Clear";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  dialogHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  dialog: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    marginTop: "40px",
    marginBottom: "20px",
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
    borderStyle: "solid",
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  title: {
    color: theme.palette.primary.main,
  },
  bb: {
    marginTop: "40px",
    marginBottom: "20px",
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main,
    color: "white",
    "&:hover": {
      backgroundColor: "white",
      color: theme.palette.primary.main,
    },
  },
  deleteColor: {
    backgroundColor: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
  avatar: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    marginBottom: 12,
  },
  clearAvatarIcon: {
    fontSize: "200%",
    color: theme.palette.error.main,
    marginBottom: 12,
    cursor: "pointer",
  },
  textfield: {
    margin: 12,
    width: 200,
  },
  field: {
    alignSelf: "flex-start",
    flexBasis: "50%",
  },
  customVariableListContainer: {
    display: "flex",
    flexWrap: "wrap",
  },
  customVariableContainer: {
    margin: 12,
  },
  customVariableClearIcon: {
    color: theme.palette.error.main,
    cursor: "pointer",
  },
}));

function NewContact(props) {
  const classes = useStyles();
  const showSnackbar = useSnackbar();
  const { open, onClose, isEdit } = props;
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [customVariables, setCustomVariables] = useState([]);
  const [customVariableLabels, setCustomVariableLabels] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState("");
  const [avatarEdited, setAvatarEdited] = useState(false);

  useEffect(() => {
    if (open && props.isEdit && props.contactDetails) {
      console.log("CONTACT DETAILS", props.contactDetails);
      setFirstName(props.contactDetails.name);
      setSurName(props.contactDetails.surname);
      setCompany(props.contactDetails.company);
      setEmail(props.contactDetails.email);
      setAvatarURL(
        props.contactDetails.avatarURL ? props.contactDetails.avatarURL : ""
      );

      if (props.contactDetails && props.contactDetails.customVariables) {
        let variables = [];
        let labels = [];
        let keys = Object.keys(props.contactDetails.customVariables);
        for (var i = 0; i < keys.length; i++) {
          labels.push(keys[i]);
          variables.push(props.contactDetails.customVariables[keys[i]]);
        }
        setCustomVariableLabels(labels);
        setCustomVariables(variables);
      }
    }
  }, [open]);

  const handleDialogClose = () => {
    void 0; // Do nothing
  };

  const handleClose = () => {
    setCustomVariables([]);
    setCustomVariableLabels([]);
    setEmail("");
    setFirstName("");
    setSurName("");
    setCompany("");
    clearAvatar();
    onClose();
  };

  const handleSave = () => {
    if (!firstName || firstName.length === 0) {
      showSnackbar("Please enter a first name.", "error");
      return;
    }
    if (!surName || surName.length === 0) {
      showSnackbar("Please enter a surname.", "error");
      return;
    }
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email || email.length === 0 || !email.match(mailformat)) {
      showSnackbar("Please enter a valid email address.", "error");
      return;
    }

    const data = new FormData();
    if (avatar) {
      data.append("avatar", avatar);
    }
    data.append("firstName", firstName);
    data.append("surName", surName);
    data.append("email", email);
    data.append("company", company);
    let customVariablesObject = {};
    for (let i = 0; i < customVariables.length; i++) {
      if (!customVariables[i] || !customVariableLabels[i]) {
        showSnackbar(
          "Please enter names and values for all variables",
          "error"
        );

        return;
      }
      if (!Boolean(customVariableLabels[i].match(/^[A-Z]+$/i))) {
        showSnackbar("Variable names must contain alphabets only.", "error");
        return;
      }
      customVariablesObject[customVariableLabels[i]] = customVariables[i];
    }
    console.log("appending custom variables", customVariables);
    data.append("customVariables", JSON.stringify(customVariablesObject));
    let url = "/api/contacts";
    if (props.isEdit) {
      console.log("adding method mask");
      url = `/api/contacts/update/${props.contactDetails.id}`;
      if (avatarEdited) {
        data.delete("avatar");
        data.append("avatar", avatar);
      } else {
        console.log("deleting avatar");
        data.delete("avatar");
      }
    }
    setLoading(true);

    for (var value of data.values()) {
      console.log(value);
    }
    axios
      .post(url, data)
      .then(async (res) => {
        if (props.isEdit) {
          showSnackbar("Contact edited");
        } else {
          showSnackbar("New contact created!", "success");
        }
        props.refreshContacts();
        handleClose();
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.status &&
          err.response.status === 400
        ) {
          showSnackbar(
            err.response.data && err.response.data.err
              ? err.response.data.err
              : "An error occured.",
            "error"
          );
          return;
        }
        showSnackbar("Error - Could not create new contact.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`/api/contacts/${props.contactDetails.id}`)
      .then(() => {
        showSnackbar("Contact deleted", "success");
        props.refreshContacts();
        handleClose();
      })
      .catch(() => {
        showSnackbar("An error occured", "error");
      });
  };

  const addNewVariables = () => {
    setCustomVariables([...customVariables, ""]);
    setCustomVariableLabels([...customVariableLabels, ""]);
  };
  const updateVariables = (index, newValue) => {
    setCustomVariables(
      customVariables.map((c, i) => {
        if (index === i) {
          return newValue;
        }
        return c;
      })
    );
  };

  const updateLabels = (index, newValue) => {
    setCustomVariableLabels(
      customVariableLabels.map((c, i) => {
        if (index === i) {
          return newValue;
        }
        return c;
      })
    );
  };

  const removeVariable = (index) => {
    setCustomVariableLabels((labels) => labels.filter((_, id) => id !== index));
    setCustomVariables((variables) =>
      variables.filter((_, id) => id !== index)
    );
  };

  const updateAvatar = (e) => {
    setAvatar(e.target.files[0]);
    setAvatarURL(URL.createObjectURL(e.target.files[0]));
    if (isEdit) {
      setAvatarEdited(true);
    }
  };

  const clearAvatar = () => {
    setAvatar(null);
    setAvatarURL("");
  };

  return (
    <div>
      {!loading && (
        <>
          <Dialog onClose={handleDialogClose} open={open} maxWidth={"sm"}>
            <div className={classes.dialogHeader}>
              <DialogTitle className={classes.title}>
                {props.isEdit ? "Edit Contact" : "New Contact"}
              </DialogTitle>
              <Avatar className={classes.avatar} src={avatarURL} />
              {avatar && (
                <ClearIcon
                  onClick={clearAvatar}
                  className={classes.clearAvatarIcon}
                />
              )}
              <Button variant="contained" color="primary" component="label">
                Add Picture
                <input type="file" hidden onChange={updateAvatar} />
              </Button>
            </div>
            <Container className={classes.dialog}>
              <Container>
                <TextField
                  required
                  id="firstname"
                  label="First Name"
                  variant="outlined"
                  margin="dense"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={classes.textfield}
                />
                <TextField
                  required
                  id="surname"
                  label="Surname"
                  variant="outlined"
                  margin="dense"
                  value={surName}
                  onChange={(e) => setSurName(e.target.value)}
                  className={classes.textfield}
                />
              </Container>
              <Container>
                <TextField
                  required
                  id="email"
                  label="Email"
                  variant="outlined"
                  margin="dense"
                  className={classes.textfield}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
                <TextField
                  id="company"
                  label="Company"
                  variant="outlined"
                  margin="dense"
                  className={classes.textfield}
                  onChange={(e) => {
                    setCompany(e.target.value);
                  }}
                  value={company}
                />
              </Container>
              {customVariables &&
                customVariables.map((c, i) => (
                  <Container>
                    <TextField
                      variant="filled"
                      margin="dense"
                      id="CustomAttribute"
                      label="Variable Name"
                      className={classes.textfield}
                      value={customVariableLabels[i]}
                      onChange={(e) => updateLabels(i, e.target.value)}
                    />
                    <TextField
                      variant="filled"
                      margin="dense"
                      id="CustomAttribute"
                      label="Variable Value"
                      className={classes.textfield}
                      value={customVariables[i]}
                      onChange={(e) => updateVariables(i, e.target.value)}
                    />
                    <ClearIcon
                      className={classes.customVariableClearIcon}
                      onClick={() => removeVariable(i)}
                    />
                  </Container>
                ))}
            </Container>

            <Container className={classes.buttons}>
              <Button
                variant="outlined"
                className={classes.bb}
                onClick={handleClose}
              >
                Back
              </Button>
              {props.isEdit && (
                <Button
                  variant="outlined"
                  className={clsx(classes.bb, classes.deleteColor)}
                  onClick={handleDelete}
                  color="secondary"
                >
                  Delete
                </Button>
              )}
              <Button
                variant="outlined"
                className={classes.button}
                onClick={addNewVariables}
              >
                Add Attribute
              </Button>
              <Button
                variant="outlined"
                className={classes.bb}
                onClick={handleSave}
              >
                Save
              </Button>
            </Container>
          </Dialog>
        </>
      )}
    </div>
  );
}
NewContact.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
export default NewContact;
