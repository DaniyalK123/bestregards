//reference: https://stackoverflow.com/questions/64296505/usecontext-inside-axios-interceptor
//stackoverflow.com/questions/48743474/how-to-detect-a-401-with-axios-and-stop-the-console-error
import React, { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import useSnackbar from "../../hooks/useSnackbar";

const WithAxios = ({ children }) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const showSnackbar = useSnackbar();

  if (!auth.axiosInterceptorSet) {
    // response interceptor to automatically log user out in case of 401
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        
        if (error.response) {
          const status = error.response.status;
          if (status && status === 401) {
            // sign user out
            auth.clearAuthCredentials();
            showSnackbar(
              "Authentication token expired. Please login again.",
              "warning"
            );
            history.replace("/");
          }
        }

        return Promise.reject(error);
      }
    );

    // request interceptor to automatically add header
    axios.interceptors.request.use(function (config) {
      const token = auth.token;
      console.log(token);
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    auth.setAxiosInterceptorSet(true);
  }

  return children;
};

export default WithAxios;
