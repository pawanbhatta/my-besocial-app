import { CircularProgress } from "@material-ui/core";
import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router";
import { useToast } from "@chakra-ui/toast";
import { useCookies } from "react-cookie";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { useMutation } from "react-query";
import "./login.css";

function Login({ address }) {
  const { dispatch, isFetching } = useContext(AuthContext);
  const [, setCookie] = useCookies(["jwt", "user", "refresh"]);
  const navigate = useNavigate();
  const toast = useToast();

  const { mutateAsync } = useMutation("login", loginCall, {
    onSuccess: (data) => {
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      setCookie("jwt", data.accessToken, { secure: true, sameSite: "None" });
      // setCookie("refresh", data.refreshToken, {
      //   secure: true,
      //   sameSite: "None",
      // });
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
      city: address.city,
    });
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginTop">
          <h3 className="loginLogo">BeSocial</h3>
        </div>
        <div className="loginCenter">
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
              minLength={6}
              placeholder="Password"
              className="loginInput"
            />
            <hr className="loginSeparator" />
            <button className="logButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="secondary" size="20px" />
              ) : (
                "Sign In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="logButton" onClick={registerButtonHandler}>
              {isFetching ? (
                <CircularProgress color="secondary" size="20px" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
        <div className="loginBottom">
          Connect with friends and the world around you on BeSocial.
        </div>
      </div>
    </div>
  );
}

export default Login;
