import React, { useState } from "react";
import Snackbar from "../components/common/Snackbar";

export const SnackbarContext = React.createContext({});

export const SnackbarContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  return (
    <SnackbarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        message,
        setMessage,
        severity,
        setSeverity,
      }}
    >
      <Snackbar />
      {children}
    </SnackbarContext.Provider>
  );
};
