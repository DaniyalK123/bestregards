import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import useSnackbar from "../../hooks/useSnackbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  spinner: {
    width: "15%",
    margin: "8px auto",
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const showSnackbar = useSnackbar();
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // helper function to validate email
  const isValidEmail = () => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      return true;
    }
    return false;
  };

  // helper function to validate password
  const isValidPassword = () => {
    if (
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(password)
    ) {
      return true;
    }
    return false;
  };

  // validate form and attempt signup
  const signUp = () => {
    if (!isValidEmail()) {
      showSnackbar("Please enter a valid email.", "error");
      return;
    }
    if (!isValidPassword()) {
      showSnackbar(
        "Password must be at least 8 characters and include one lowercase character, one uppercase character, a number, and a special character.",
        "error"
      );
      return;
    }
    if (!(firstName.length > 0) || !(lastName.length > 0)) {
      showSnackbar("Please enter first and last name.", "error");
      return;
    }
    if (!(password === confirmPassword)) {
      showSnackbar("Passwords must match.", "error");
      return;
    }

    setSubmitting(true);
    axios
      .post("/api/signup", { email, password, firstName, lastName })
      .then((res) => {
        showSnackbar("Signup successful!", "success");
        auth.setCredentials(res.data.user, res.data.token);
      })
      .catch((err) => {
        if (err.response) {
          if (
            err.response &&
            err.response.status === 400 &&
            err.response.data &&
            err.response.data.err &&
            err.response.data.err === "Email already exists"
          ) {
            showSnackbar("An account with this email already exists", "error");
          } else {
            showSnackbar("An error occured", "error");
          }
        } else {
          showSnackbar("An error occured", "error");
        }
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              {!submitting && (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={signUp}
                >
                  Sign Up
                </Button>
              )}
              {submitting && (
                <div className={classes.spinner}>
                  <CircularProgress />
                </div>
              )}
            </Grid>
          </Grid>

          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
