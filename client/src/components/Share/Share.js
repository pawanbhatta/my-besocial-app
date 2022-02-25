import {
  Cancel,
  EmojiEmotions,
  Label,
  PermMedia,
  Room,
} from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./styles.css";
import axios from "axios";

function Share() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const { user } = useContext(AuthContext);

  const desc = useRef();
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
      image: "",
      imageId: "",
      filename: "",
    };

    if (file) {
      let imageId = (Math.random() + 1).toString(36).substring(2);
      let data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.image = filename;
      newPost.imageId = imageId;

      try {
        var savedImage = await axios.post(
          `/upload?username=${user._id}&type=post&postId=${imageId}`,
          data
        );
      } catch (error) {
        console.log(error);
      }

      try {
        newPost.image = savedImage.data.file.filename;
        await axios.post("/posts", newPost);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={
              user.profilePicture
                ? SI + "download/" + user.profilePicture
                : PF + "person/NoAvatarProfile.png"
            }
            alt=""
            className="shareProfileImage"
          />
          <input
            ref={desc}
            type="text"
            className="shareInput"
            placeholder={`What's in your mind, ${user.username}?`}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={handleSubmit}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                name="file"
                accept=".png, .jpg, .jpeg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tags</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}

export default Share;
