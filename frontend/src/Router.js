import React, { useContext } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import SignUp from "./components/Auth/Signup";
import SignIn from "./components/Auth/Signin";
import Dashboard from "./components/Dashboard";
import WithAxios from "./components/common/WithAxios";

export default function Router() {
  const auth = useContext(AuthContext);
  auth.loadCredentialsFromLocalStorage();
  return (
    <BrowserRouter>
      <Switch>
        {!auth.authenticated && (
          <>
            <Route exact path="/">
              <SignIn />
            </Route>
            <Route exact path="/register">
              <SignUp />
            </Route>
            <Route>
              <Redirect to="/" />
            </Route>
          </>
        )}

        {auth.authenticated && (
          <>
            <Route path="/">
              <WithAxios>
                <Dashboard />
              </WithAxios>
            </Route>
          </>
        )}
      </Switch>
    </BrowserRouter>
  );
}
