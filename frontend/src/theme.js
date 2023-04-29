import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#963484",
    },
    secondary: {
      main: "#89b6a5",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ea9010",
    },
    success: {
      main: "#e4ff1a",
    },
  },
});

export default theme;
