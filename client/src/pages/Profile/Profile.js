import "./styles.css";
import { Feed, ProfileRightbar } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { Add, Cancel } from "@material-ui/icons";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router";

const Profile = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const { username } = useParams();
  const [user, setUser] = useState({});
  const [type, setType] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const profileImageHandler = (e) => {
    setFile(e.target.files[0]);
    setType("profile");
  };

  const coverImageHandler = (e) => {
    setFile(e.target.files[0]);
    setType("cover");
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const userProfile = {
      profilePicture: "",
      coverPicture: "",
      profileImageId: "",
      coverImageId: "",
    };

    if (file) {
      let imageId = (Math.random() + 1).toString(36).substring(2);
      let data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      if (type === "profile") {
        userProfile.profilePicture = filename;
        userProfile.profileImageId = imageId;
      } else {
        userProfile.coverPicture = filename;
        userProfile.coverImageId = imageId;
      }

      try {
        var savedImage = await axios.post(
          `/upload?username=${user._id}&type=${type}&postId=${imageId}`,
          data
        );

        type === "profile"
          ? (userProfile.profilePicture = savedImage.data.file.filename)
          : (userProfile.coverPicture = savedImage.data.file.filename);
        await axios.put(`/users/${user._id}?type=${type}`, userProfile);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

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
      {/* <Topbar /> */}
      <Navbar
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
      />
      {showSuggestions ? (
        navigate("/")
      ) : (
        <div className="profile">
          {/* <Sidebar /> */}
          <div className="profileRight">
            <div className="profileRightTop">
              <div className="profileCover">
                <img
                  src={
                    user.coverPicture
                      ? SI + "download/" + user.coverPicture
                      : PF + "person/defaultCover.png"
                  }
                  alt=""
                  className="profileCoverImage"
                />
                <form className="changeProfileBottom" onSubmit={updateProfile}>
                  <div className="changeProfileOptions">
                    <label htmlFor="cover" className="changeProfileOption">
                      <Add
                        data-tooltip="Change Cover Image"
                        className="addCoverImage addProfile"
                        htmlColor="tomato"
                      />

                      <input
                        style={{ display: "none" }}
                        type="file"
                        id="cover"
                        name="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={coverImageHandler}
                      />
                    </label>
                  </div>
                </form>
                <img
                  src={
                    user.profilePicture
                      ? SI + "download/" + user.profilePicture
                      : PF + "person/NoAvatarProfile.png"
                  }
                  alt=""
                  className="profileUserImage"
                />

                <form className="changeProfileBottom" onSubmit={updateProfile}>
                  <div className="changeProfileOptions">
                    <label htmlFor="profile" className="changeProfileOption">
                      <Add
                        data-tooltip="Change Profile Image"
                        className="addProfileImage addProfile"
                        htmlColor="tomato"
                      />
                      <input
                        style={{ display: "none" }}
                        type="file"
                        id="profile"
                        name="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={profileImageHandler}
                      />
                    </label>
                  </div>

                  {file && (
                    <div className="changeProfileImgContainer">
                      <img
                        className="changeProfileImg"
                        src={URL.createObjectURL(file)}
                        alt=""
                      />
                      <Cancel
                        className="changeProfileCancelImg"
                        onClick={() => setFile(null)}
                      />
                      <button className="changeButton" type="submit">
                        Update
                      </button>
                    </div>
                  )}
                </form>
              </div>
              <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
              </div>
            </div>
            <div className="profileRightBottom">
              <Feed username={username} />
              <ProfileRightbar username={username} user={user} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
