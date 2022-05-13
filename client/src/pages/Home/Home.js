import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { refreshTokenCall } from "../../apiCalls";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router";
import { Topbar, Sidebar, Feed } from "../../components";
import HomeRightbar from "../../components/Rightbar/HomeRightbar";
import ProfileRightbar from "../../components/Rightbar/ProfileRightbar";
import "./styles.css";
import Navbar from "../../components/Navbar/Navbar";
import { io } from "socket.io-client";
import SuggestFriends from "../../components/SuggestFriends/SuggestFriends";

function Home() {
  const { username } = useParams();
  const { dispatch } = useContext(AuthContext);
  const [cookies, setCookie] = useCookies(["jwt", "user", "refresh"]);
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { user } = cookies;

  useEffect(() => {
    // Get refresh token
    const getRefreshToken = async (refreshToken) => {
      const data = await refreshTokenCall(refreshToken, dispatch);
      return data;
    };

    axios.interceptors.request.use(
      async (config) => {
        let currentDate = new Date();
        const { jwt, refresh } = cookies;

        const decodedToken = jwt_decode(jwt);

        if (decodedToken.exp * 1000 < currentDate.getTime()) {
          const data = getRefreshToken(refresh);

          setCookie("jwt", data.accessToken, {
            secure: true,
            sameSite: "None",
          });
          setCookie("refresh", data.refreshToken, {
            secure: true,
            sameSite: "None",
          });
          setCookie("user", data.user, { secure: true, sameSite: "None" });

          config.headers["authorization"] = "Bearer " + refresh;
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
  }, [cookies, dispatch, setCookie]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current?.emit("addUser", user._id);
    socket.current?.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings?.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  return (
    <>
      {/* <Topbar /> */}
      <Navbar
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        socket={socket.current}
      />
      <div className="homeContainer">
        <Sidebar />
        {!showSuggestions ? (
          <Feed socket={socket.current} />
        ) : (
          <SuggestFriends />
        )}
        {username && <ProfileRightbar username={username} />}
        <HomeRightbar onlineUsers={onlineUsers} />
      </div>
    </>
  );
}

export default Home;
