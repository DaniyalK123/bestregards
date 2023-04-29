import React, { useState, useEffect } from "react";
import axios from "axios";
import useSnackbar from "../../hooks/useSnackbar";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  makeStyles,
  withStyles,
  CircularProgress,
} from "@material-ui/core";

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

const useStyles = makeStyles((theme) => {
  return {
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
    center: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      flexDirection: "column",
    },
  };
});

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const showSnackbar = useSnackbar();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const classes = useStyles();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/jobs")
      .then((res) => {
        setJobs(res.data.jobs);
      })
      .catch(() => {
        showSnackbar("Error fetching data from the server", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <div className={classes.center}>
        <h1>Jobs</h1>
      </div>
      <div className={classes.center}>
        {!loading && jobs.length > 0 && (
          <TableContainer className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow hover role="checkbox">
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Name</StyledTableCell>
                  <StyledTableCell align="center">Type</StyledTableCell>
                  <StyledTableCell align="center">Progress</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? jobs.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : jobs
                ).map((job) => (
                  <TableRow hover role="checkbox" key={job._id}>
                    <StyledTableCell align="center">
                      {new Date(job.date).toLocaleDateString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">{job.name}</StyledTableCell>
                    <StyledTableCell align="center">{job.type}</StyledTableCell>
                    <StyledTableCell align="center">
                      {job.sentEmails}/{job.totalEmails}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {job.status}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              style={{ marginRight: "35%" }}
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={jobs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TableContainer>
        )}
        {!loading && jobs.length === 0 && <h1>No jobs yet</h1>}
        {loading && <CircularProgress size={100} />}
      </div>
    </div>
  );
}
