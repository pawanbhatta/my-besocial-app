import "./styles.css";
import { Users } from "../../dummyData";
import { Online } from "../index";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";

function Rightbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [isFollowing, setIsFollowing] = useState(
    currentUser.followings.includes(user?._id)
  );

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

  // useEffect(() => {
  // const getFriend = async (username) => {
  //   if (username && currentUser.username !== username) {
  //     try {
  //       const friend = await axios.get("/users?username=" + username);
  //       console.log("user friends".friend);
  //       setUser(friend.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   } else {
  //     setUser(currentUser);
  //     console.log("set user", user);
  //   }
  // };

  // const getFriends = async (userId) => {
  //   let friendList = [];
  //   console.log("userId, currentUser, user", userId, currentUser, user);
  //   if (userId && userId !== currentUser._id) {
  //     try {
  //       friendList = await axios.get("/users/friends/" + userId);
  //       setFriends(friendList.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   } else {
  //     friendList = await axios.get("/users/friends/" + currentUser._id);
  //     setFriends(friendList.data);
  //   }
  // };

  // getFriend(username);

  // getFriends(user._id);

  // setUser(currentUser);
  // getFriends(currentUser._id);
  // }, []);

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src={`${PF}gift.png`} alt="" className="birthdayImage" />
          <span className="birthdayText">
            <b>Puskar Raj Joshi</b> and <b> 3 other friends </b> have birthday
            today
          </span>
        </div>
        <img src={`${PF}ad.png`} alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  // const ProfileRightbar = () => {
  //   return (
  //     <>
  //       {user.username !== currentUser.username && (
  //         <button className="rightbarFollowButton" onClick={handleClick}>
  //           {isFollowing ? "Unfollow" : "Follow"}
  //           {isFollowing ? <Remove /> : <Add />}
  //         </button>
  //       )}
  //       <h4 className="rightbarTitle">User Information</h4>
  //       <div className="rightbarInfo">
  //         <div className="rightbarInfoItem">
  //           <span className="rightbarInfoKey">City:</span>
  //           <span className="rightbarInfoValue">
  //             {user.city ? user.city : "Not Given"}
  //           </span>
  //         </div>
  //         <div className="rightbarInfoItem">
  //           <span className="rightbarInfoKey">From:</span>
  //           <span className="rightbarInfoValue">
  //             {user.from ? user.from : "Not Given"}
  //           </span>
  //         </div>
  //         <div className="rightbarInfoItem">
  //           <span className="rightbarInfoKey">Relationship:</span>
  //           <span className="rightbarInfoValue">
  //             {user.relationship === 1
  //               ? "Single"
  //               : user.relationship === 2
  //               ? "Married"
  //               : "Not Stated"}
  //           </span>
  //         </div>
  //       </div>
  //       <h4 className="rightbarTitle">User Friends</h4>
  //       <div className="rightbarFollowings">
  //         {friends.length !== 0 &&
  //           friends.map((friend) => (
  //             <Link
  //               key={friend._id}
  //               to={"/profile/" + friend.username}
  //               style={{ textDecoration: "none" }}
  //             >
  //               <div className="rightbarFollowing">
  //                 <img
  //                   src={
  //                     user.profilePicture
  //                       ? PF + user.profilePicture
  //                       : PF + "person/NoAvatarProfile.png"
  //                   }
  //                   alt=""
  //                   className="rightbarFollowingImg"
  //                 />
  //                 <span className="rightbarFollowingName">
  //                   {friend.username}
  //                 </span>
  //               </div>
  //             </Link>
  //           ))}
  //       </div>
  //     </>
  //   );
  // };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {username ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

export default Rightbar;
