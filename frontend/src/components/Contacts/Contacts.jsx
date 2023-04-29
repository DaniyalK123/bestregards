import React, { useState, useEffect } from "react";
import { Button, Container, makeStyles } from "@material-ui/core";
import Export from "./Export";
import Searchbar from "./Searchbar";
import ContactTable from "./ContactTable";
import NewContact from "./NewContact";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import useSnackbar from "../../hooks/useSnackbar";
import AddVariableToContacts from "./AddVariableToContacts";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "50px",
  },
  back: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tableContainer: { width: "90%", margin: "auto" },
  sb: {
    flexGrow: 0.7,
  },
  center: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    flexDirection: "column",
  },
}));

function Contacts() {
  const classes = useStyles();
  const [openDialogAddVariable, setOpenDialogAddVariable] = useState(false);
  const [openDialogNewContact, setOpenDialogNewContact] = useState(false);
  const [refreshId, setRefreshId] = useState(0);
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const showSnackbar = useSnackbar();

  const handleCloseNewContact = () => {
    setOpenDialogNewContact(false);
  };

  const _openDialogNewContact = () => {
    setOpenDialogNewContact(true);
  };

  const handleCloseAddVariable = () => {
    setOpenDialogAddVariable(false);
  };

  const _openDialogAddVariable = () => {
    setOpenDialogAddVariable(true);
  };

  const refreshContacts = () => {
    setRefreshId((rid) => rid + 1);
  };

  function createData(
    name,
    surname,
    email,
    company,
    id,
    avatarURL,
    customVariables
  ) {
    return {
      name,
      surname,
      email,
      company,
      id,
      avatarURL,
      customVariables,
    };
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/contacts")
      .then((res) => {
        const rowData = res.data.contacts.map((c) =>
          createData(
            c.firstName,
            c.surName,
            c.email,
            c.company,
            c._id,
            c.avatarURL,
            c.customVariables
          )
        );

        setRows(rowData);
        setAllRows(rowData);
      })

      .catch((err) => {
        console.log(err);
        showSnackbar("Error fetching data from server.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshId]);

  return (
    <div className={classes.tableContainer}>
      <Container className={classes.root}>
        <Fab color="primary" aria-label="add" onClick={_openDialogNewContact}>
          <AddIcon />
        </Fab>
        <NewContact
          open={openDialogNewContact}
          onClose={handleCloseNewContact}
          refreshContacts={refreshContacts}
        />
        <AddVariableToContacts
          open={openDialogAddVariable}
          onClose={handleCloseAddVariable}
          refreshContacts={refreshContacts}
        />
        <div className={classes.sb}>
          <Searchbar setRows={setRows} allRows={allRows} />
        </div>
        <Export />
      </Container>
      <ContactTable
        rows={rows}
        loading={loading}
        setLoading={setLoading}
        email={email}
        refreshContacts={refreshContacts}
      />
      <div className={classes.center}>
        <Button
          color="primary"
          variant="contained"
          onClick={_openDialogAddVariable}
        >
          Add a variable to all contacts
        </Button>
      </div>
    </div>
  );
}

export default Contacts;
