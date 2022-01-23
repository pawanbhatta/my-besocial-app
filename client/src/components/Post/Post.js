import { useState, useEffect, useContext } from "react";
import { MoreVert } from "@material-ui/icons";
import "./styles.css";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import http from "http";

function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  // const [permit, setPermit] = useState(false);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;
  const { user: currentUser } = useContext(AuthContext);

  const downloadImage = async () => {
    // alert("Do you want to download this image");
    await http.get("/images/download/" + post.image);
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  const likeHandler = async () => {
    try {
      await axios.put(`/posts/${post._id}/like`, {
        userId: currentUser._id,
      });
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    axios
      .get(`/users/profile?userId=${post.userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.log("Error Occurred ", err));
  }, [post.userId]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/NoAvatarProfile.png"
                }
                className="postProfileImage"
                alt=""
              />
            </Link>
            <Link to={`profile/${user.username}`}>
              <span className="postUsername">{user.username}</span>
            </Link>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert className="postTopIcon" />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img
            src={post.image ? SI + "download/" + post.image : ""}
            // src={post.image ? PF + post.image : ""}
            className="postImage"
            alt=" PostImage"
            loading="lazy"
            onClick={downloadImage}
          />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              src={`${PF}like.png`}
              alt=""
              onClick={likeHandler}
              className="likeIcon"
            />
            <img
              src={`${PF}heart.png`}
              alt=""
              onClick={likeHandler}
              className="likeIcon"
            />
            <span className="postLikeCounter">{like} people liked it</span>
          </div>
          <div className="postBottomRight">
            <div className="postCommentText">{post.comment} comments</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
