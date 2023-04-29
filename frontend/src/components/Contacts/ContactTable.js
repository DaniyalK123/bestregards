import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  makeStyles,
  withStyles,
  CircularProgress,
} from "@material-ui/core";
import ReactExport from "react-export-excel";
import Checkbox from "@material-ui/core/Checkbox";
import NewContact from "./NewContact";
import useSnackbar from "../../hooks/useSnackbar";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontSize: 20,
  },
  body: {
    fontSize: 15,
  },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  table: {
    width: "100%",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
    borderStyle: "solid",
  },
  loader: {
    width: "fit-content",
    margin: "12px auto",
  },
}));

function ContactTable(props) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialogEditContact, setOpenDialogEditContact] = useState(false);
  const [contact, setContact] = useState();
  const showSnackbar = useSnackbar();

  const {
    loading,
    setLoading,
    rows,
    refreshContacts,
    selectMode,
    selectedContactIds,
    setSelectedContactIds,
  } = props;

  const selectContact = (contactId) => {
    if (!selectedContactIds.includes(contactId)) {
      setSelectedContactIds((selectedIds) => [...selectedIds, contactId]);
    } else {
      setSelectedContactIds((selectedIds) =>
        selectedIds.filter((id) => id !== contactId)
      );
    }
  };

  const handleClose = () => {
    setOpenDialogEditContact(false);
  };

  const openDialog = (c) => {
    console.log("OPENING", c);
    setOpenDialogEditContact(true);
    setContact(c);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      {loading && (
        <div className={classes.loader}>
          <CircularProgress size={100} />
        </div>
      )}
      {!loading && (
        <>
          <TableContainer className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow hover role="checkbox">
                  {selectMode && (
                    <StyledTableCell align="center">Selected</StyledTableCell>
                  )}
                  <StyledTableCell align="center">Name</StyledTableCell>
                  <StyledTableCell align="center">Surname</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Company</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    onClick={() => {
                      if (!selectMode) openDialog(row);
                    }}
                  >
                    {selectMode && selectedContactIds && (
                      <StyledTableCell align="center">
                        <Checkbox
                          checked={selectedContactIds.includes(row.id)}
                          onChange={() => selectContact(row.id)}
                          inputProps={{ "aria-label": "primary checkbox" }}
                        />
                      </StyledTableCell>
                    )}
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.surname}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <NewContact
              isEdit={true}
              contactDetails={contact}
              open={openDialogEditContact}
              onClose={handleClose}
              refreshContacts={refreshContacts}
            />
            <TablePagination
              style={{ marginRight: "35%" }}
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      )}
    </div>
  );
}

export default ContactTable;
