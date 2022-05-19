import {
  Cancel,
  CancelOutlined,
  EmojiEmotions,
  Label,
  PermMedia,
  Room,
} from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import "./styles.css";
import axios from "axios";

function Share({ socket }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const [cookies] = useCookies(["jwt"]);
  const { user } = cookies;

  const desc = useRef();
  const [file, setFile] = useState(null);
  const [faces, setFaces] = useState([]);
  const [face, setFace] = useState("");
  const [tags, setTags] = useState([]);
  const [tagNames, setTagNames] = useState([]);

  const imgRef = useRef();
  // const canvasRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
      image: "",
      imageId: "",
      filename: "",
      tags: tagNames,
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
        const createdPost = await axios.post("/posts", newPost);

        const tagsnames = tagNames.filter((t) => t._id !== user._id);
        const tagNotification = {
          sender: user._id,
          receivers: tagsnames,
          postId: createdPost?.data._id,
          type: "tag",
        };

        try {
          const savedNotif = await axios.post(
            "/posts/tagfriend",
            tagNotification
          );
        } catch (error) {
          console.log(error);
        }

        // handleNotification(3);

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  // const handleNotification = (type) => {
  //   socket.emit("sendTagNotification", {
  //     sender: user._id,
  //     receivers: tagNames,
  //     type,
  //   });
  // };

  const imageHandler = async (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0]) {
        // let imageId = (Math.random() + 1).toString(36).substring(2);
        let data = new FormData();
        const filename = e.target.files[0].name;
        data.append("name", filename);
        data.append("file", e.target.files[0]);
        console.log(e.target.files[0]);
        const res = await axios.post(
          "http://localhost:8000/api/predictfacereact",
          data
        );
        setFile(e.target.files[0]);

        setFaces(res.data.output);
        console.log("faces here", faces);
      }
    } else {
      console.log("no file sent");
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      const usernames = faces.map((f) => f.name);
      console.log("usernames", usernames);
      const { data } = await axios.get(
        `/users/tagged/friends?usernames=${usernames}`
      );
      setTagNames(data);
    };
    fetchTags();
    console.log("tagged friends here", tagNames);
  }, [faces]);

  const removeTag = (user) => {
    setTagNames((prev) => prev.filter((p) => p.username !== user.username));
  };
  // const [pointerX, setPointerX] = useState(0);
  // const [pointerY, setPointerY] = useState(0);

  // const handleMouse = (event) => {
  //   setPointerX(event.pageX);
  //   setPointerY(event.pageY);

  //   faces.map((f) => {
  //     if (
  //       pointerX > 413 + (f["left"] - 413) &&
  //       pointerX < f["right"] - 413 &&
  //       pointerY > f["top"] + 207 &&
  //       pointerY < f["bottom"] - 207
  //     ) {
  //       // console.log("Face : ", f);
  //       setFace(f["name"]);
  //     }
  //   });

  //   // x-350 y-210
  //   // bottom - 132
  //   // left+ 121
  //   // right equal
  //   // top - 15

  //   // setInterval(pointerCheck, 5000);

  //   // function pointerCheck() {
  //   //   console.log("Cursor at: " + pointerX + ", " + pointerY);
  //   // }
  // };

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
          <div
            className="shareImgContainer"
            style={{
              // width: image.width,
              // height: image.height,
              position: "relative",
            }}
          >
            <img
              className="shareImg"
              ref={imgRef}
              src={URL.createObjectURL(file)}
              alt=""
              // onMouseMove={handleMouse}
            />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
            {/* <canvas width="500" height="500" style={{ position: "absolute" }} /> */}
            <div className="tagBox">
              <h3>With :</h3>
              <div className="tagNames">
                {tagNames?.map((f) => (
                  <div className="tagName" key={f._id}>
                    {f.username}
                    <div className="removeTag">
                      <CancelOutlined onClick={() => removeTag(f)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <form className="shareBottom" onSubmit={handleSubmit}>
          <div className="shareOptions">
            <label htmlFor="fileh" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="fileh"
                name="file"
                accept=".png, .jpg, .jpeg"
                onChange={(e) => imageHandler(e)}
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
