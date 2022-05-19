import "./navbar.css";
import {
  ArrowDropDown,
  ForumTwoTone,
  Home,
  NotificationImportant,
  Person,
  Search,
} from "@material-ui/icons";
import { CloseFriend } from "../index";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import axios from "axios";

function Navbar({ showSuggestions, setShowSuggestions, socket }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const [showOption, setShowOption] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messageNotifications, setMessageNotifications] = useState([]);
  const [tagNotifications, setTagNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [notifsender, setNotifSender] = useState(null);

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [cookies, , removeCookie] = useCookies(["jwt", "user", "refresh"]);
  const { user } = cookies;

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
    if (query.length > 1) fetchData();
    if (query.length < 2) setData([]);
  }, [query]);

  useEffect(() => {
    socket?.on("getNotification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    // socket?.on("getTagNotification", (data) => {
    //   setNotifications((prev) => [...prev, data]);
    // });

    socket?.on("getText", (data) => {
      setMessageNotifications((prev) => [...prev, data]);
    });
  }, [socket]);

  const displayNotification = (n) => {
    const nSender = getSender(n.sender);
    let action;
    let notifs;
    if (nSender?._id !== user._id) {
      if (n.type === "tag") {
        action = "tagged";
        console.log("its tag notif", n);
        notifs = (
          <span
            key={n._id}
            className="notification"
          >{`${nSender?.username} ${action} you on a post`}</span>
        );
        return notifs;
      } else if (n.type === "comment") {
        action = "commented";
      } else {
        action = "liked";
      }
    }
    notifs = (
      <span
        key={n._id}
        className="notification"
      >{`${notifsender?.username} ${action} your post`}</span>
    );

    return notifs;
  };

  const displayTextNotification = ({ sender, text }) => {
    getSender(sender);
    return (
      <span className="notification">{`${notifsender?.username}: ${text} `}</span>
    );
  };

  const getSender = async (sender) => {
    try {
      const { data } = await axios.get(`/users/profile?userId=${sender}`);
      setNotifSender(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleRead = () => {
    setNotifications([]);
    // setTagNotifications([]);
    setOpen(false);
  };

  const handleReadText = () => {
    setMessageNotifications([]);
  };

  // const handleNotificationFetch = () => {
  //   setOpen(!open);
  //   console.log("notifs before", notifications);

  //   const fetchNotifications = async () => {
  //     const res = await axios.get("/posts/taggedfriends");
  //     // setNotifications(data);
  //     console.log("got dta", res.data);
  //     setTagNotifications((prev) => [...prev, data]);

  //     console.log("notifs now", notifications);
  //   };

  //   fetchNotifications();
  // };

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
                  {item.username ? (
                    <Link
                      key={item._id}
                      to={`/profile/${item.username}`}
                      style={{ paddingTop: "5px" }}
                    >
                      <CloseFriend user={item} />
                    </Link>
                  ) : (
                    item.desc
                  )}
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
        <div className="menuItem" onClick={() => setShowSuggestions(false)}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Home />
          </Link>
        </div>
        <div
          className="menuItem"
          onClick={() => setShowSuggestions(!showSuggestions)}
        >
          <Person />
          {/* <span className="topbarIconBadge">1</span> */}
        </div>
        <div className="menuItem">
          <Link
            to="/messenger"
            style={{ textDecoration: "none" }}
            onClick={() => setShowSuggestions(false)}
          >
            <ForumTwoTone />
            {messageNotifications.length > 0 && (
              <span className="topbarIconBadge" onClick={handleReadText}>
                {messageNotifications.length}
              </span>
            )}
          </Link>
        </div>
        <div
          className="menuItem"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <NotificationImportant />
          {notifications.length > 0 && (
            <span className="topbarIconBadge">{notifications.length}</span>
          )}
          {/* {tagNotifications.length > 0 && (
            <span className="topbarIconBadge" onClick={handleRead}>
              {tagNotifications.length}
            </span>
          )} */}
          {open && (
            <div className="notifications">
              {notifications.length > 0 &&
                notifications.map((n) => displayNotification(n))}

              {notifications.length > 0 ? (
                <button className="nButton" onClick={handleRead}>
                  Mark as read
                </button>
              ) : (
                <span className="nButton" onClick={handleRead}>
                  No Notifications
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
