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
  TextField,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";

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
  },
  table: {
    width: 500,
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
    borderStyle: "solid",
  },
}));

function VariableTable({
  selectedTemplateId,
  templates,
  templateVariableValues,
  setTemplateVariableValues,
  templateVariables,
  setTemplateVariables,
}) {
  const classes = useStyles();

  const updateVariableValue = (newVal, index) => {
    setTemplateVariableValues(
      templateVariableValues.map((value, i) => {
        if (i !== index) {
          return value;
        } else {
          return newVal;
        }
      })
    );
  };

  useEffect(() => {
    if (selectedTemplateId && templates) {
      const selectedTemplate = templates.filter(
        (t) => t._id === selectedTemplateId
      )[0];

      setTemplateVariables(selectedTemplate.templateVariables);
      const variableValues = [];
      selectedTemplate.templateVariables.forEach((v) => {
        variableValues.push("");
      });
      setTemplateVariableValues(variableValues);
    }
  }, [selectedTemplateId]);

  return (
    <div>
      <TableContainer className={classes.root}>
        <Table className={classes.table} style={{ width: 500 }}>
          <TableHead>
            <TableRow hover role="checkbox">
              <StyledTableCell align="center">Variable</StyledTableCell>
              <StyledTableCell align="center"> Value </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templateVariables.map((templateVariable, index) => (
              <TableRow>
                <StyledTableCell align="center">
                  {templateVariable}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  <TextField
                    value={templateVariableValues[index]}
                    onChange={(e) => updateVariableValue(e.target.value, index)}
                  />{" "}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default VariableTable;
