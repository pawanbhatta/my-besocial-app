import "./styles.css";
import { Topbar, Sidebar, Feed, ProfileRightbar } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

const Profile = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const { username } = useParams();

  useEffect(() => {
    const fetchUser = () => {
      axios
        .get(`/users/profile?username=${username}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => console.log("Error Occurred ", err));
    };

    fetchUser();
  }, [username]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : PF + "person/defaultCover.png"
                }
                alt=""
                className="profileCoverImage"
              />
              <img
                src={
                  user.coverPicture
                    ? user.coverPicture
                    : PF + "person/NoAvatarProfile.png"
                }
                alt=""
                className="profileUserImage"
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">
                {user.desc}
                {/* Try to be the man of value rather than success */}
              </span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <ProfileRightbar username={username} user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
