import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from "@material-ui/core";
import { CSVLink } from "react-csv";
import exportFromJSON from "export-from-json";
import useSnackbar from "../../hooks/useSnackbar";
import axios from "axios";

function Export() {
  const [format, setFormat] = useState("");
  const [openFormControl, setOpenFormControl] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbar();
  const handleChange = (event) => {
    setFormat(event.target.value);
  };

  const handleClose = () => {
    setOpenFormControl(false);
  };

  const handleOpen = () => {
    setOpenFormControl(true);
  };
  useEffect(() => {
    setLoading(true);
    const csvData = [["First Name", "Surname", "Email", "Company"]];
    const jsonData = [];
    console.log("SENDING REQUEST");
    const contactsPromise = axios.get("/api/contacts");
    Promise.all([contactsPromise])
      .then((res) => {
        res[0].data.contacts.map((c) => {
          csvData.push([
            `${c.firstName}`,
            `${c.surName}`,
            `${c.email}`,
            `${c.company}`,
          ]);
        });
        setCsvData(csvData);
        res[0].data.contacts.map((c) => {
          jsonData.push({
            contact: {
              "First Name": `${c.firstName}`,
              Surname: c.surName,
              Email: c.email,
              Company: c.company,
              customVariables: c.customVariables,
            },
          });
        });
        setJsonData(jsonData);
      })

      .catch((err) => {
        console.log(err);
        showSnackbar("Error fetching data from server.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getCsvData = () => {
    return csvData;
  };
  const getJsonData = () => {
    return JSON.stringify(jsonData);
  };

  return (
    <div>
      {!loading && (
        <>
          <FormControl style={{ width: "70px" }}>
            <InputLabel id="select-export-label">Export</InputLabel>
            <Select
              labelId="select-export-label"
              id="select-export"
              open={openFormControl}
              onClose={handleClose}
              onOpen={handleOpen}
              value={format}
              onChange={handleChange}
            >
              <MenuItem value=""></MenuItem>
              <MenuItem value={1}>
                <CSVLink filename="contacts.csv" data={getCsvData()}>
                  {" "}
                  CSV
                </CSVLink>
              </MenuItem>
              <MenuItem value={2}>
                <CSVLink filename="contacts.json" data={getJsonData()}>
                  {" "}
                  JSON
                </CSVLink>
              </MenuItem>
            </Select>
          </FormControl>
        </>
      )}
    </div>
  );
}
export default Export;
