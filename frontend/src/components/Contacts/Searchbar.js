import React, { useState, useEffect } from "react";
import SearchBar from "material-ui-search-bar";

function Searchbar(props) {
  const [searched, setSearched] = useState("");
  const { setRows, allRows } = props;

  useEffect(() => {
    console.log("SEARCHED", searched);
    const searchNames = () => {
      // match first name
      console.log("ALL ROWS", allRows);
      const matchedRows = allRows.filter(
        (r) =>
          r.name.toLowerCase().includes(searched.toLowerCase()) ||
          r.surname.toLowerCase().includes(searched.toLowerCase()) ||
          (r.name.toLowerCase() + " " + r.surname.toLowerCase()).includes(
            searched.toLowerCase()
          )
      );

      setRows(matchedRows);
    };
    searchNames();
  }, [searched]);

  const cancelSearch = () => {
    setSearched("");
  };

  return (
    <div>
      <SearchBar
        value={searched}
        onChange={(val) => {
          setSearched(val);
        }}
        onCancelSearch={() => cancelSearch()}
        cancelOnEscape={"true"}
        placeholder={"Enter name to search"}
      />
    </div>
  );
}

export default Searchbar;
