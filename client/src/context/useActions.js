// import useToast from "../experiment/MessagesToast/useToast";
import { useToast } from "@chakra-ui/toast";

import { useCookies } from "react-cookie";
import { useContext } from "react";
import apiClient from "./http-common";
import { useNavigate } from "react-router-dom";
function useActions(context) {
  const { dispatch } = useContext(context);
  const setMessage = useToast(context);
  const [cookies, setCookie, removeCookie] = useCookies([
    "jwt",
    "refresh",
    "user",
  ]);
  const navigate = useNavigate();
  const foundError = (err) => {
    if (err.response.status === (401 || 500)) {
      //Unauthorized
      removeCookie("jwt", {
        path: process.env.REACT_APP_PATH || "/",
        domain: process.env.REACT_APP_DOMAIN,
        secure: true,
        sameSite: "None",
      });
      apiClient
        .post("/auth/refresh", { token: cookies["refresh"] })
        .then((res) => {
          setCookie("jwt", res.data.accessToken, {
            path: process.env.REACT_APP_PATH || "/",
            domain: process.env.REACT_APP_DOMAIN,
            maxAge: 26000,
            secure: true,
            sameSite: "None",
          });
          setCookie("refresh", res.data.refreshToken, {
            path: process.env.REACT_APP_PATH || "/",
            domain: process.env.REACT_APP_DOMAIN,
            maxAge: 2600000,
            secure: true,
            sameSite: "None",
          });
          dispatch({ type: "REFRESH_SUCCESS", payload: res.data });
          return;
        })
        .catch((error) => {
          setMessage(error.response, "Refresh token error", "Login again");
          removeCookie("user", {
            path: process.env.REACT_APP_PATH || "/",
            domain: process.env.REACT_APP_DOMAIN,
            secure: true,
            sameSite: "None",
          });
          removeCookie("refresh", {
            path: process.env.REACT_APP_PATH || "/",
            domain: process.env.REACT_APP_DOMAIN,
            secure: true,
            sameSite: "None",
          });
          dispatch({ type: "LOGOUT" });
          navigate("/");
        });
      return;
    }
    setMessage(err.response);
  };
  const regSuccess = (res) => {
    // console.log("hey there.. are you seeing the message");
    try {
      setMessage(res, "Register Successful", "LogIn to access your profile");
      navigate("/");
    } catch (e) {
      console.log("error in Set Message");
    }
  };
  const loginSuccess = (res) => {
    console.log("hey there.. are you seeing the message");
    try {
      setMessage(res, "Login Successful", "Logged In Successfully");
    } catch (e) {
      console.log("error in Set Message");
    }
    setCookie("jwt", res.data.accessToken, {
      path: process.env.REACT_APP_PATH || "/",
      domain: process.env.REACT_APP_DOMAIN,
      maxAge: 26000,
      secure: true,
      sameSite: "None",
    });
    setCookie("refresh", res.data.refreshToken, {
      path: process.env.REACT_APP_PATH || "/",
      domain: process.env.REACT_APP_DOMAIN,
      maxAge: 2600000,
      secure: true,
      sameSite: "None",
    });
    setCookie("user", res.data.user, {
      path: process.env.REACT_APP_PATH || "/",
      domain: process.env.REACT_APP_DOMAIN,
      maxAge: 26000,
      secure: true,
      sameSite: "None",
    });
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    console.log(process.env.REACT_APP_DOMAIN);
    navigate("/");
  };
  const logoutSuccess = (res) => {
    setMessage(
      res,
      "Logout Successful",
      "You have been logged out successfully"
    );
    removeCookie("jwt", {
      path: process.env.REACT_APP_PATH || "/",
      domain: process.env.REACT_APP_DOMAIN,
      secure: true,
      sameSite: "None",
    });
    removeCookie("refresh", {
      path: process.env.REACT_APP_PATH || "/",
      domain: process.env.REACT_APP_DOMAIN,
      secure: true,
      sameSite: "None",
    });
    removeCookie("user", {
      path: process.env.REACT_APP_PATH || "/",
      domain: process.env.REACT_APP_DOMAIN,
      secure: true,
      sameSite: "None",
    });
    console.log(
      "hey there.. are you seeing the message? I've cleared the cookies"
    );
    dispatch({ type: "LOGOUT" });
    navigate("/auth/logIn");
  };
  return { foundError, loginSuccess, logoutSuccess, regSuccess };
}

export default useActions;
