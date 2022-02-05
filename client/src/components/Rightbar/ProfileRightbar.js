import "./styles.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";

function ProfileRightbar({ username, user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(
    currentUser.followings.includes(user._id)
  );

  useEffect(() => {
    if (navigator.geolocation) {
      // navigator.geolocation.watchPosition(function (position) {
      //   console.log("Latitude is :", position.coords.latitude);

      //   console.log("Longitude is :", position.coords.longitude);
      // });

      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log("Latitude is :", position.coords.latitude);

          console.log("Longitude is :", position.coords.longitude);
        },
        function (error) {
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    }
  }, []);

  useEffect(() => {
    setIsFollowing(currentUser.followings.includes(user._id));
  }, [user._id, currentUser.followings]);

  const handleClick = async () => {
    try {
      if (isFollowing) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setIsFollowing(!isFollowing);
    } catch (err) {}
  };

  useEffect(() => {
    const getFriends = async () => {
      // if (username) {
      try {
        const friendList = await axios.get(
          "/users/friends?username=" + username
        );
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
      // }
    };
    getFriends();
  }, [username]);

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {isFollowing ? "Unfollow" : "Follow"}
            {isFollowing ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">
              {user.city ? user.city : "Not Given"}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">
              {user.from ? user.from : "Not Given"}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 2
                ? "Married"
                : "Not Stated"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {friends.length !== 0 &&
            friends.map((friend) => (
              <Link
                key={friend._id}
                to={"/profile/" + friend.username}
                style={{ textDecoration: "none" }}
              >
                <div className="rightbarFollowing">
                  <img
                    src={
                      user.profilePicture
                        ? SI + "download/" + user.profilePicture
                        : PF + "person/NoAvatarProfile.png"
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">
                    {friend.username}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileRightbar;
