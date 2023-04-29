import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  makeStyles,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import ContactTable from "../Contacts/ContactTable";
import SelectTemplate from "./SelectTemplate";
import VariableTable from "./VariableTable";
import { Link } from "react-router-dom";
import useSnackbar from "../../hooks/useSnackbar";
import axios from "axios";
import Searchbar from "../Contacts/Searchbar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    marginTop: 50,
    marginBottom: 50,
    alignItems: "center",
  },
  header: {
    textAlign: "center",
    flex: 1,
  },
  marginBottom: {
    marginBottom: 16,
  },
  center: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    flexDirection: "column",
  },
}));

function SendingBulkJobs() {
  const classes = useStyles();

  const [isEmailRegistered, setIsEmailRegistered] = useState(true);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [templateVariables, setTemplateVariables] = useState([]);
  const [templateVariableValues, setTemplateVariableValues] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const showSnackbar = useSnackbar();

  function createData(name, surname, email, company, id, avatarURL) {
    return { name, surname, email, company, id, avatarURL };
  }

  const resetFields = () => {
    setName("");
    setSubject("");
    setSelectedContactIds([]);
    setSelectedTemplateId("");
    setTemplateVariables([]);
    setTemplateVariableValues([]);
  };

  const submit = () => {
    setSubmitting(true);
    if (!name) {
      showSnackbar("Please enter a job name.", "error");
      return;
    }
    if (!subject) {
      showSnackbar("Please enter the email subject.", "error");
      return;
    }
    if (selectedContactIds.length === 0) {
      showSnackbar("Please select at least one contact", "error");
      return;
    }
    if (!selectedTemplateId) {
      showSnackbar("Please select a template", "error");
      return;
    }

    for (let i = 0; i < templateVariableValues.length; i++) {
      if (!templateVariableValues[i]) {
        showSnackbar("Please enter all variable values", "error");
        return;
      }
    }

    axios
      .post("/api/bulkjob", {
        name,
        subject,
        contactIds: selectedContactIds,
        templateId: selectedTemplateId,
        templateVariables,
        templateVariableValues,
      })
      .then(() => {
        resetFields();
        showSnackbar("Job created!");
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.check
        ) {
          showSnackbar(
            `Contact ${err.response.data.check.contact} does not have the variable ${err.response.data.check.variable}`,
            "error"
          );
        } else {
          showSnackbar("An error occured", "error");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    const templatesPromise = axios.get("/api/templates");
    const contactsPromise = axios.get("/api/contacts");
    const nylasEmailPromise = axios.get("/api/nylas");

    Promise.all([templatesPromise, contactsPromise, nylasEmailPromise])
      .then((res) => {
        setTemplates(res[0].data.templates);
        const contactsData = res[1].data.contacts.map((c) =>
          createData(
            c.firstName,
            c.surName,
            c.email,
            c.company,
            c._id,
            c.avatarURL
          )
        );
        setContacts(contactsData);
        setAllContacts(contactsData);
      })
      .catch((err) => {
        console.log("REJECT", err);
        if (
          err &&
          err.response &&
          err.response.status &&
          err.response.status === 404
        ) {
          console.log("404");
          setIsEmailRegistered(false);
        } else {
          showSnackbar("Error fetching data from server.", "error");
        }
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div>
      <h1 className={classes.header}> Bulk Jobs </h1>
      {!loading && isEmailRegistered && (
        <>
          <Container className={classes.root}>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
            />
            <TextField
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              label="Subject"
              className={classes.marginBottom}
            />
            <SelectTemplate
              templates={templates}
              setSelectedTemplateId={setSelectedTemplateId}
              selectedTemplateId={selectedTemplateId}
            />
            {selectedTemplateId && (
              <VariableTable
                templates={templates}
                selectedTemplateId={selectedTemplateId}
                templateVariableValues={templateVariableValues}
                setTemplateVariableValues={setTemplateVariableValues}
                templateVariables={templateVariables}
                setTemplateVariables={setTemplateVariables}
              />
            )}
          </Container>
          <Searchbar setRows={setContacts} allRows={allContacts} />

          {!loading && (
            <ContactTable
              rows={contacts}
              selectMode
              selectedContactIds={selectedContactIds}
              setSelectedContactIds={setSelectedContactIds}
            />
          )}

          <Container className={classes.root}>
            <div style={{ float: "right" }}>
              {!submitting && (
                <Button variant="contained" color="primary" onClick={submit}>
                  Send Emails
                </Button>
              )}
              {submitting && <CircularProgress />}
            </div>
          </Container>
        </>
      )}

      {!loading && !isEmailRegistered && (
        <div className={classes.center}>
          <h1>No email registered</h1>
          <h2>
            Click <Link to="/email">here</Link> to register your email
          </h2>
        </div>
      )}

      {loading && (
        <div className={classes.root}>
          <CircularProgress size={100} />
        </div>
      )}
    </div>
  );
}

export default SendingBulkJobs;
