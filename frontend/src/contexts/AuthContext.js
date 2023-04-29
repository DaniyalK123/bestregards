import React, { useState } from "react";
export const AuthContext = React.createContext({});

const AuthContextProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");
  const [userType, setUserType] = useState(0);
  const [name, setName] = useState("");
  const [axiosInterceptorSet, setAxiosInterceptorSet] = useState(false);

  const setCredentials = (user, token) => {
    console.log("SETTING CREDENTIALS");
    setToken(token);
    localStorage.setItem("bestregards_token", token);
    setUid(user._id);
    localStorage.setItem("bestregards_uid", user._id);
    setName(user.firstName);
    localStorage.setItem("bestregards_name", user.firstName);
    setUserType(user.userType);
    localStorage.setItem("bestregards_userType", user.userType);
    setAuthenticated(true);
  };

  const clearAuthCredentials = () => {
    console.log("CLEARING CREDENTIALS");
    setToken("");
    setUid("");
    setName("");
    setUserType(0);
    setAuthenticated(false);
    localStorage.clear();
  };

  const loadCredentialsFromLocalStorage = () => {
    console.log("LOADING CREDENTIALS FROM STORAGE");
    if (localStorage.getItem("bestregards_token")) {
      setToken(localStorage.getItem("bestregards_token"));
      setAuthenticated(true);
    }
    if (localStorage.getItem("bestregards_uid")) {
      setUid(localStorage.getItem("bestregards_uid"));
    }
    if (localStorage.getItem("bestregards_name")) {
      setName(localStorage.getItem("bestregards_name"));
    }
    if (localStorage.getItem("bestregards_userType")) {
      setUserType(localStorage.getItem("bestregards_userType"));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        uid,
        token,
        userType,
        name,
        setCredentials,
        clearAuthCredentials,
        loadCredentialsFromLocalStorage,
        axiosInterceptorSet,
        setAxiosInterceptorSet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
