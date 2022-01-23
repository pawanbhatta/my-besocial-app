import { CircularProgress } from "@material-ui/core";
import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router";
import { useToast } from "@chakra-ui/toast";
import { useCookies } from "react-cookie";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { useMutation } from "react-query";
import "./styles.css";

function Login() {
  const { dispatch, isFetching } = useContext(AuthContext);
  const [, setCookie] = useCookies(["jwt", "user", "refresh"]);
  const navigate = useNavigate();
  const toast = useToast();

  const { mutateAsync } = useMutation("login", loginCall, {
    onSuccess: (data) => {
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      setCookie("jwt", data.accessToken, { secure: true, sameSite: "None" });
      setCookie("refresh", data.refreshToken, {
        secure: true,
        sameSite: "None",
      });
      setCookie("user", data.user, { secure: true, sameSite: "None" });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: error,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const email = useRef();
  const password = useRef();

  const registerButtonHandler = () => {
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mutateAsync({
      email: email.current.value,
      password: password.current.value,
    });
  };

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
