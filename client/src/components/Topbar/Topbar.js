import "./topbar.css";
import { Chat, Notifications, Person, Search } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useCookies } from "react-cookie";

function Topbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const navigate = useNavigate();
  const { user, dispatch, accessToken, refreshToken } = useContext(AuthContext);
  const [, , removeCookie] = useCookies(["jwt", "user", "refresh"]);

  const logoutHandler = () => {
    removeCookie("jwt");
    removeCookie("user");
    removeCookie("refresh");
    dispatch({
      type: "LOGOUT",
    });
    console.log("logout", user, accessToken, refreshToken);
    navigate("/login");
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">BeSocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            type="text"
            placeholder="Search for friend or post"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink" onClick={logoutHandler}>
            Log Out
          </span>
          <Link to={`/profile/${user.username}`}>
            <span className="topbarLink">{user.username}</span>
          </Link>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? SI + "download/" + user.profilePicture
                : PF + "person/NoAvatarProfile.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}

export default Topbar;
