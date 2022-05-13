import { CircularProgress } from "@material-ui/core";
import { DoneOutline, CancelOutlined } from "@material-ui/icons";
// import axios from "axios";
import React, { useContext, useRef, useState, useEffect } from "react";
import { useToast } from "@chakra-ui/toast";
import { useNavigate, Link } from "react-router-dom";
import { signupCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
// import { useMutation } from "react-query";
// import { useCookies } from "react-cookie";
import "./register.css";

function Register({ address }) {
  const { isFetching, dispatch, error } = useContext(AuthContext);
  const toast = useToast();
  const [errorCall, setErrorCall] = useState(false);
  // const [, setCookie] = useCookies(["jwt", "user"]);
  // const { isLoading, error, isError, mutateAsync } = useMutation(
  //   "register",
  //   signupCall,
  //   {
  //     onSuccess: (data) => {
  //       dispatch({ type: "REFRESH_SUCCESS", payload: data });
  //       setCookie("jwt", data.accessToken, { secure: true, sameSite: "None" });
  //       setCookie("user", data.user, { secure: true, sameSite: "None" });
  //       navigate("/");
  //     },
  //   }
  // );

  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const city = useRef();
  const from = useRef();
  const desc = useRef();

  const [cityFocused, setCityFocused] = useState("");

  // const [latitude, setLatitude] = useState("");
  // const [longitude, setLongitude] = useState("");
  // const [address, setAddress] = useState(null);
  const [myInterests, setMyInterests] = useState([]);
  const [gender, setGender] = useState("");
  const [relation, setRelation] = useState("");

  const interests = [
    "Adventure",
    "Travelling",
    "Food",
    "Lifestyles",
    "Sports",
    "Music",
    "Cooking",
    "Movies",
    "Science",
  ];

  const interestHandler = (i) => {
    if (!myInterests.includes(i)) setMyInterests((prev) => [...prev, i]);
  };

  // const API_endpoint = "https://us1.locationiq.com/v1/reverse.php?";

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     async function (position) {
  //       setLatitude(position.coords.latitude);
  //       setLongitude(position.coords.longitude);

  //       let finalAPI = `${API_endpoint}key=${process.env.REACT_APP_MAP_PRIVATE_KEY}&lat=${latitude}&lon=${longitude}&format=json`;

  //       const { data } = await axios.get(finalAPI);
  //       const { city, country, suburb } = data.address;
  //       const displayName = data.display_name
  //         .split(city)[0]
  //         .split(",")
  //         .slice(0, -1);

  //       setAddress({ city, suburb, country, displayName });
  //     },
  //     function (error) {
  //       console.error("Error Code = " + error.code + " - " + error.message);
  //     }
  //   );
  // }, [latitude, longitude]);

  const navigate = useNavigate();

  const loginHandler = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.current.value !== passwordAgain.current.value) {
      passwordAgain.current.setCustomValidity("Password didn't match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        passwordAgain: passwordAgain.current.value,
        city: address.city ? address.city : city.current.value,
        from: from.current.value,
        desc: desc.current.value,
        gender,
        relation,
        myInterests,
      };

      // await mutateAsync(user);
      signupCall(user, dispatch);
      if (user && !error) {
        navigate("/login");
      } else {
        setErrorCall(!errorCall);
        navigate("/register");
      }
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }, [errorCall]);

  const handleGender = (e) => {
    setGender(e.target.value);
  };
  const handleRelation = (e) => {
    setRelation(e.target.value);
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerTop">
          <Link to="/">
            <h3 className="registerLogo">BeSocial</h3>
          </Link>
        </div>
        <div className="registerCenter">
          <div className="registerCenterTop">
            <div className="registerLeft">
              <form className="registerBox">
                <div className="inputGroup">
                  <input
                    ref={username}
                    required
                    type="text"
                    placeholder="Username"
                    className="registerInput"
                  />
                </div>
                <div className="inputGroup">
                  <input
                    ref={email}
                    required
                    type="email"
                    placeholder="Email"
                    className="registerInput"
                  />
                </div>
                <div className="inputGroup">
                  <input
                    ref={password}
                    required
                    minLength={6}
                    type="password"
                    placeholder="Password"
                    className="registerInput"
                  />
                  <input
                    ref={passwordAgain}
                    required
                    minLength={6}
                    type="password"
                    placeholder="Password Again"
                    className="registerInput"
                  />
                </div>

                <div className="inputGroup">
                  <input
                    ref={city}
                    minLength={5}
                    type="text"
                    placeholder="City You Live"
                    defaultValue={cityFocused}
                    className="registerInput"
                    onClick={() => setCityFocused(address?.city)}
                  />
                  <input
                    ref={from}
                    minLength={5}
                    type="text"
                    placeholder="Where are you from ?"
                    className="registerInput"
                  />
                </div>
                <div className="groupInput relationAndGender">
                  <div className="genderGroup">
                    <p className="labelish">Gender:</p>
                    <div id="paymentContainer" className="paymentOptions">
                      <div id="payCC" className="floatBlock">
                        <label htmlFor="male">
                          <input
                            id="male"
                            type="radio"
                            value="Male"
                            checked={gender === "Male" ? true : false}
                            onChange={handleGender}
                          />
                          Male
                        </label>
                      </div>

                      <div id="payInvoice" className="floatBlock">
                        <label htmlFor="female">
                          <input
                            id="female"
                            type="radio"
                            value="Female"
                            checked={gender === "Female" ? true : false}
                            onChange={handleGender}
                          />
                          Female
                        </label>
                      </div>

                      <div id="pay3rdParty" className="floatBlock">
                        <label htmlFor="other">
                          <input
                            id="other"
                            type="radio"
                            value="Other"
                            checked={gender === "Other" ? true : false}
                            onChange={handleGender}
                          />
                          Other
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="relationGroup">
                    <div className="genderGroup">
                      <p className="labelish">Relationship Status:</p>
                      <div id="paymentContainer" className="paymentOptions">
                        <div id="payCC" className="floatBlock">
                          <label htmlFor="single">
                            <input
                              id="single"
                              type="radio"
                              value="Single"
                              checked={relation === "Single" ? true : false}
                              onChange={handleRelation}
                            />
                            Single
                          </label>
                        </div>

                        <div id="payInvoice" className="floatBlock">
                          <label htmlFor="relationship">
                            <input
                              id="relationship"
                              type="radio"
                              value="Relationship"
                              checked={
                                relation === "Relationship" ? true : false
                              }
                              onChange={handleRelation}
                            />
                            In Relationship
                          </label>
                        </div>

                        <div id="pay3rdParty" className="floatBlock">
                          <label htmlFor="married">
                            <input
                              id="married"
                              type="radio"
                              value="Married"
                              checked={relation === "Married" ? true : false}
                              onChange={handleRelation}
                            />
                            Married
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="inputGroup shareInput">
                  <textarea
                    ref={desc}
                    minLength={5}
                    placeholder={`Something About You`}
                    className="registerInput shareInput"
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="registerRight">
              <h3 className="interestTopic">What interests you ?</h3>
              <div className="interestOptions">
                {interests.map((i) => {
                  return (
                    <div
                      key={i}
                      className="interest"
                      onClick={(e) => interestHandler(i)}
                    >
                      {i}
                      <span className="interestChoice">
                        <DoneOutline />
                      </span>
                    </div>
                  );
                })}
              </div>
              <hr className="interestSeparator" />
              <div className="interestSelected">
                {myInterests.map((i) => {
                  return (
                    <div className="interest">
                      {i}
                      <span className="interestChoice">
                        <CancelOutlined />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="registerCenterBottom">
            <div className="regButton">
              <button
                // isloading={isLoading.toString()}
                className="registerButton"
                type="submit"
                disabled={isFetching}
                onClick={handleSubmit}
              >
                {isFetching ? (
                  <CircularProgress color="secondary" size="20px" />
                ) : (
                  "Register"
                )}
              </button>
            </div>
            <span className="registerForgot">Already have Account?</span>
            <div className="regButton">
              <button className="registerLoginButton" onClick={loginHandler}>
                {isFetching ? (
                  <CircularProgress color="secondary" size="20px" />
                ) : (
                  "Log In"
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="registerBottom">
          Connect with friends and the world around you on BeSocial.
        </div>
      </div>
    </div>
  );
}

export default Register;
