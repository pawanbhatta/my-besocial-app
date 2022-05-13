import "./styles.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import { useCookies } from "react-cookie";

function ProfileRightbar({ username, user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;
  const [friends, setFriends] = useState([]);

  const [cookies, setCookie] = useCookies(["jwt", "user"]);
  const { user: currentUser } = cookies;

  const { dispatch } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(
    currentUser.followings.includes(user._id)
  );

  useEffect(() => {
    setIsFollowing(currentUser.followings.includes(user._id));
  }, [user._id, currentUser.followings]);

  const handleClick = async () => {
    try {
      if (isFollowing) {
        const { data } = await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        setCookie("user", data.updatedUser, { secure: true, sameSite: "None" });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        const { data } = await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        setCookie("user", data.updatedUser, { secure: true, sameSite: "None" });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setIsFollowing(!isFollowing);
    } catch (err) {}
  };

  useEffect(() => {
    const getFriends = async () => {
      try {
        const { data } = await axios.get("/users/friends/" + user?._id);
        setFriends(data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [user]);

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
          {friends.length > 0 &&
            friends.map((friend) => (
              <Link
                key={friend._id}
                to={"/profile/" + friend.username}
                style={{ textDecoration: "none" }}
              >
                <div className="rightbarFollowing">
                  <img
                    src={
                      friend?.profilePicture
                        ? SI + "download/" + friend.profilePicture
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
