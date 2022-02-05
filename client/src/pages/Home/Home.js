// import { useCookies } from "react-cookie";
// import jwt_decode from "jwt-decode";
// import axios from "axios";
// import { refreshTokenCall } from "../../apiCalls";
// import { useContext, useEffect } from "react";
// import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router";
import { Topbar, Sidebar, Feed } from "../../components";
import HomeRightbar from "../../components/Rightbar/HomeRightbar";
import ProfileRightbar from "../../components/Rightbar/ProfileRightbar";
import "./styles.css";

function Home() {
  const { username } = useParams();
  // const { dispatch } = useContext(AuthContext);
  // const [cookies] = useCookies(["jwt", "user", "refresh"]);

  // useEffect(() => {
  //   // Get refresh token
  //   const getRefreshToken = async (refreshToken) => {
  //     await refreshTokenCall(refreshToken, dispatch);
  //   };

  //   axios.interceptors.request.use(
  //     async (config) => {
  //       let currentDate = new Date();
  //       const { jwt, refresh } = cookies;
  //       const decodedToken = jwt_decode(jwt);
  //       if (decodedToken.exp * 1000 < currentDate.getTime()) {
  //         getRefreshToken(refresh);
  //         config.headers["authorization"] = "Bearer " + refresh;
  //       }
  //       return config;
  //     },
  //     (err) => {
  //       return Promise.reject(err);
  //     }
  //   );
  // }, [cookies, dispatch]);

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        {username && <ProfileRightbar username={username} />}
        <HomeRightbar />
      </div>
    </>
  );
}

export default Home;
