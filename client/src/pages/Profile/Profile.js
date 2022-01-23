import "./styles.css";
import { Topbar, Sidebar, Feed, ProfileRightbar } from "../../components";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { Add, Cancel } from "@material-ui/icons";

const Profile = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const [user, setUser] = useState({});
  const [type, setType] = useState("");
  const { username } = useParams();

  const [file, setFile] = useState(null);

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
        console.log("before reload");
        window.location.reload();
        console.log("after reload");
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
      <Topbar />
      <div className="profile">
        <Sidebar />
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
              <button
                data-tooltip="Change Cover Image"
                className="addCoverImage addProfile"
                value="cover"
                htmlFor="cover"
                onClick={updateProfile}
              >
                <Add />
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="cover"
                  name="file"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </button>
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
                      value="profile"
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
              <span className="profileInfoDesc">
                {user.desc}
                Try to be the man of value rather than success
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
