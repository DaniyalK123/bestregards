import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Router from "./Router";
import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarContextProvider } from "./contexts/SnackbarContext";
import theme from "./theme";
import AuthContextProvider from "./contexts/AuthContext";
import axios from "axios";
import WithAxios from "./components/common/WithAxios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <SnackbarContextProvider>
          <Router />
        </SnackbarContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
