import { CircularProgress } from "@material-ui/core";
import React, { useContext, useRef } from "react";
// import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router";
import { useToast } from "@chakra-ui/toast";
import { useCookies } from "react-cookie";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
// import axios from "axios";
import { useMutation } from "react-query";
import "./styles.css";

function Login() {
  const { dispatch, isFetching } = useContext(AuthContext);
  const [, setCookie] = useCookies(["jwt", "user"]);
  const navigate = useNavigate();
  const { error, isError, mutateAsync } = useMutation("login", loginCall, {
    onSuccess: (data) => {
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      setCookie("jwt", data.accessToken, { secure: true, sameSite: "None" });
      setCookie("user", data.user, { secure: true, sameSite: "None" });
      navigate("/");
    },
  });
  const toast = useToast();

  const email = useRef();
  const password = useRef();

  const registerButtonHandler = () => {
    navigate("/register");
  };

  if (isError) {
    console.log("error message", error.message);
    toast({ title: error.message, status: "error" });
  }

  // Get refresh token
  // const getRefreshToken = async (refreshToken) => {
  //   await refreshTokenCall(refreshToken, dispatch);
  // };

  // axios.interceptors.request.use(
  //   async (config) => {
  //     let currentDate = new Date();
  //     console.log("access token", accessToken);
  //     const decodedToken = jwt_decode(accessToken);
  //     if (decodedToken.exp * 1000 < currentDate.getTime()) {
  //       getRefreshToken(refreshToken);
  //       config.headers["authorization"] = "Bearer " + accessToken;
  //     }
  //     return config;
  //   },
  //   (err) => {
  //     console.log("error occured here", err);
  //     return Promise.reject(err);
  //   }
  // );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mutateAsync({
      email: email.current.value,
      password: password.current.value,
    });
    // loginCall(
    //   { email: email.current.value, password: password.current.value },
    //   dispatch
    // );
  };
  // console.log(accessToken);

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">BeSocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on BeSocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input
              ref={email}
              type="email"
              required
              placeholder="Email"
              className="loginInput"
            />
            <input
              required
              ref={password}
              type="password"
              minLength="6"
              placeholder="Password"
              className="loginInput"
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="secondary" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button
              className="loginRegisterButton"
              onClick={registerButtonHandler}
            >
              {isFetching ? (
                <CircularProgress color="secondary" size="20px" />
              ) : (
                "Create A New Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
