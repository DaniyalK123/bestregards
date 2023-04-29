import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import SequenceSelect from "./SequenceSelect";
import Preview from "./Preview";
import clsx from "clsx";
import IconButton from "../../common/IconButton";
import TemplateSelect from "./TemplateSelect";
import useSnackbar from "../../../hooks/useSnackbar";
import { AuthContext } from "../../../contexts/AuthContext";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
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
  textField: {
    width: 260,
  },
}));

export default function Sequences() {
  const classes = useStyles();
  const theme = useTheme();
  const showSnackbar = useSnackbar();
  const [isAddingNewSequence, setIsAddingNewSequence] = useState(false);
  const [selectedSequenceId, setSelectedSequenceId] = useState();
  const [newSequenceName, setNewSequenceName] = useState("");
  // sequences will be an array of names and ids of the user's sequences for showing in the sequence select
  const [sequences, setSequences] = useState([]);
  const [selectedSequenceName, setSelectedSequenceName] = useState();
  // selected sequence templates will hold the template ids of the currently selected sequence
  // allTemplates is an array of the data of all of the user's templates.
  const [selectedSequenceTemplates, setSelectedSequenceTemplates] = useState(
    []
  );
  const [nonSelectedSequenceTemplates, setNonSelectedSequenceTemplates] =
    useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  const createSequence = () => {
    if (!newSequenceName || newSequenceName.length === 0) {
      showSnackbar("Please enter a sequence name.", "error");
      return;
    }
    setLoading(true);
    axios
      .post("/api/sequences", {
        name: newSequenceName,
        templates: selectedSequenceTemplates.map((t) => t._id),
      })
      .then(async (res) => {
        showSnackbar("Sequence Created!", "success");
        await updateSequenceList();
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error - Could not create sequence.", "error");
      })
      .finally(() => {
        setLoading(false);
        showSnackbar("Sequence created!", "success");
      });
  };

  const updateSequence = () => {
    if (!selectedSequenceName || selectedSequenceName.length === 0) {
      showSnackbar("Please enter a sequence name.", "error");
      return;
    }
    axios
      .patch(`/api/sequences/${selectedSequenceId}`, {
        name: selectedSequenceName,
        templates: selectedSequenceTemplates,
      })
      .then((res) => {
        showSnackbar("Sequence updated!", "success");
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("An error occured.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteSequence = () => {
    setLoading(true);
    axios
      .delete(`/api/sequences/${selectedSequenceId}`)
      .then((res) => {
        showSnackbar("Sequence deleted!", "success");
        setSelectedSequenceId(null);
        setSelectedSequenceName("");
        setSelectedSequenceTemplates([]);
        setNonSelectedSequenceTemplates(allTemplates);
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("An error occured.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateSequenceList = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/sequences")
        .then((res) => {
          setSequences(res.data.sequences);
          setSelectedSequenceTemplates([]);
          setNonSelectedSequenceTemplates(allTemplates);
          setNewSequenceName("");
          setIsAddingNewSequence(false);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  useEffect(() => {
    setLoading(true);
    const sequencesPromise = axios.get("/api/sequences");
    const templatesPromise = axios.get("/api/templates");
    Promise.all([sequencesPromise, templatesPromise])
      .then((res) => {
        setSequences(res[0].data.sequences);
        setAllTemplates(res[1].data.templates);
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error fetching data from server.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // get data for the selected sequence
  useEffect(() => {
    const _setSelectedTemplates = (sequenceTemplates) => {
      const _selectedTemplates = allTemplates.filter((t) =>
        sequenceTemplates.includes(t._id)
      );
      const _nonSelectedTemplates = allTemplates.filter(
        (t) => !sequenceTemplates.includes(t._id)
      );
      setSelectedSequenceTemplates(_selectedTemplates);
      setNonSelectedSequenceTemplates(_nonSelectedTemplates);
    };

    if (selectedSequenceId) {
      const selectedSequence = sequences.filter(
        (s) => s._id === selectedSequenceId
      )[0];
      setSelectedSequenceName(selectedSequence.name);
      _setSelectedTemplates(selectedSequence.templates.map((t) => t._id));
    }
  }, [selectedSequenceId]);

  // reset selected templates when the user clicks the add sequence button
  useEffect(() => {
    if (isAddingNewSequence) {
      setNonSelectedSequenceTemplates(allTemplates);
      setSelectedSequenceTemplates([]);
    }
  }, [isAddingNewSequence]);

  return (
    <div className={classes.container}>
      {loading && <CircularProgress size={100} />}
      {!loading && (
        <>
          <div className={classes.item}>
            <SequenceSelect
              isAddingNewSequence={isAddingNewSequence}
              setIsAddingNewSequence={setIsAddingNewSequence}
              setSelectedSequenceId={setSelectedSequenceId}
              setSelectedSequenceName={setSelectedSequenceName}
              sequences={sequences}
              newSequenceName={newSequenceName}
              setNewSequenceName={setNewSequenceName}
            />
          </div>
          {selectedSequenceName && selectedSequenceId && (
            <div className={classes.item}>
              <TextField
                className={classes.textField}
                id="outlined-basic"
                label="Sequence Name"
                variant="outlined"
                autoComplete="off"
                value={selectedSequenceName}
                onChange={(e) => {
                  setSelectedSequenceName(e.target.value);
                }}
              />
            </div>
          )}
          {(selectedSequenceId || isAddingNewSequence) && (
            <>
              <div className={classes.item}>
                {allTemplates.length > 0 && (
                  <TemplateSelect
                    selectedSequenceTemplates={selectedSequenceTemplates}
                    nonSelectedSequenceTemplates={nonSelectedSequenceTemplates}
                    setSelectedSequenceTemplates={setSelectedSequenceTemplates}
                    setNonSelectedSequenceTemplates={
                      setNonSelectedSequenceTemplates
                    }
                  />
                )}
                {allTemplates.length === 0 && <h2>No templates found</h2>}
              </div>
              <div className={classes.item}>
                <Preview
                  selectedSequenceTemplates={selectedSequenceTemplates}
                />
              </div>
            </>
          )}
          <div className={clsx(classes.item, classes.buttonRow)}>
            {isAddingNewSequence && (
              <IconButton
                ButtonIcon={AddIcon}
                label="Add"
                color={theme.palette.secondary.main}
                onClick={() => createSequence()}
              />
            )}
            {selectedSequenceId && (
              <IconButton
                ButtonIcon={SaveIcon}
                label="Save"
                color={theme.palette.secondary.main}
                onClick={() => updateSequence()}
              />
            )}
            {selectedSequenceId && (
              <IconButton
                ButtonIcon={DeleteForeverIcon}
                label="Delete"
                color={theme.palette.error.main}
                onClick={() => deleteSequence()}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
