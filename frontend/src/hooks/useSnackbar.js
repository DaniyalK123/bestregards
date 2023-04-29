import { useContext } from "react";
import { SnackbarContext } from "../contexts/SnackbarContext";

/**
 * Abstraction for using the snackbar context to easily display a snackbar from any component
 * in the app.
 * Just use this hook and call the setSnackbarMessage method
 * Possible severity levels: sucess, warning, info, error
 */
export default function useSnackbar() {
  const snackbarContext = useContext(SnackbarContext);

  const setSnackbarMessage = (message, severity) => {
    snackbarContext.setMessage(message);
    snackbarContext.setSeverity(severity);
    snackbarContext.setIsOpen(true);
  };

  return setSnackbarMessage;
}
