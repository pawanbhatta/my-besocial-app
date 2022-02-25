import "./navbar.css";
import {
  ArrowDropDown,
  ForumTwoTone,
  Home,
  NotificationImportant,
  Person,
  Search,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import axios from "axios";

function Navbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const [showOption, setShowOption] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const [, , removeCookie] = useCookies(["jwt", "user", "refresh"]);

  const logoutHandler = () => {
    removeCookie("jwt");
    removeCookie("user");
    removeCookie("refresh");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/posts/searchData?q=${query}`);
      setData(res.data);
    };
    if (query.length > 2) fetchData();
    if (query.length < 3) setData([]);
  }, [query]);

  return (
    <div className="nav">
      <div className="navTop">
        <div className="navItem navLogo">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo">BeSocial</span>
          </Link>
        </div>
        <div className="navItem navSearch">
          <div className="search">
            <Search className="searchIcon" />
            <input
              type="text"
              placeholder="        Search here"
              className="searchInput"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {data.length > 0
            ? data.map((item) => (
                <li style={{ listStyleType: "none" }} key={item._id}>
                  {item.username || item.desc}
                </li>
              ))
            : ""}
        </div>
        <div className="navItem navbarProfile">
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
          <Link to={`/profile/${user.username}`}>
            <span className="navbarUsername">{user.username}</span>
          </Link>
          <ArrowDropDown
            fontSize="large"
            onClick={() => setShowOption(!showOption)}
            className="profileArrow"
          />
          {showOption ? (
            <div className="options">
              <Link to={`/profile/${user.username}`}>
                <span className="topbarLink">Profile ({user.username})</span>
              </Link>
              <span className="option">Settings</span>
              <hr />
              <span className="option" onClick={logoutHandler}>
                Logout
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="navBottom">
        <div className="menuItem">
          <Link to="/" style={{ textDecoration: "none" }}>
            <Home />
          </Link>
        </div>
        <div className="menuItem">
          <Person />
          <span className="topbarIconBadge">1</span>
        </div>
        <div className="menuItem">
          <ForumTwoTone />
          <span className="topbarIconBadge">1</span>
        </div>
        <div className="menuItem">
          <NotificationImportant />
          <span className="topbarIconBadge">1</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
