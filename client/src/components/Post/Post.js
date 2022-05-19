import { useState, useEffect, useContext, useRef } from "react";
import { Cancel, MoreVert } from "@material-ui/icons";
import "./styles.css";
import axios from "axios";
import { format } from "timeago.js";
import { useToast } from "@chakra-ui/toast";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useCookies } from "react-cookie";
import http from "http";
import { updatePostCall } from "../../apiCalls";
import CommentBox from "../CommentBox/CommentBox";

function Post({ post, socket }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const [showOption, setShowOption] = useState(false);

  const [user, setUser] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const [hasImage, setHasImage] = useState(post.image);
  const [desc, setDesc] = useState(post.desc);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const [cookies] = useCookies(["jwt", "user"]);
  const { user: currentUser } = cookies;

  const { dispatch, error } = useContext(AuthContext);
  const [currentPost, setCurrentPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [commentLength, setCommentLength] = useState(
    currentPost.comments.length
  );

  const toast = useToast();

  const downloadImage = async () => {
    // alert("Do you want to download this image");
    await http.get("/images/download/" + post.image);
  };

  useEffect(() => {}, [commentLength]);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, currentPost.userId]);

  const likeHandler = async () => {
    try {
      await axios.put(`/posts/${post._id}/like`, {
        userId: currentUser._id,
      });
      !isLiked && handleNotification("like");
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const handleNotification = (type) => {
    socket.emit("sendNotification", {
      sender: currentUser._id,
      receiver: currentPost.userId,
      type,
    });
  };

  const deleteHandler = async (e) => {
    setShowOption(false);
    try {
      await axios.delete(`/posts/${post._id}`, { userId: currentUser._id });
      window.location.reload();
    } catch (err) {
      console.log(err);
      dispatch({ type: "ERROR", payload: err });
    }
  };

  const updateHandler = async () => {
    setShowOption(false);
    if (post.userId === currentUser._id) {
      setIsUpdating(true);
    } else {
      dispatch({ type: "ERROR", payload: "You can update only your posts" });
    }
  };

  const showCommentHandler = () => {
    setShowComments(!showComments);
  };

  const updatePost = async (e) => {
    e.preventDefault();
    setIsUpdating(false);
    try {
      const info = {
        userId: currentUser._id,
        postId: post._id,
        desc,
        image: hasImage,
      };
      const newPost = await updatePostCall(info, dispatch);
      setCurrentPost(newPost);
    } catch (err) {
      console.log(err);
      dispatch({ type: "ERROR", payload: err });
    }
  };

  // useEffect(() => {
  //   const getComments = async () => {
  //     try {
  //       const { data } = await axios.get(`/comments/${post._id}`);
  //       setComments(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getComments();
  // }, [post._id]);

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      dispatch({ type: "ERROR", payload: "" });
    }
  }, [toast, dispatch, error]);

  useEffect(() => {
    axios
      .get(`/users/profile?userId=${post.userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.log("Error Occurred ", err);
      });
    setCurrentPost(post);
  }, [post.userId, post]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? SI + "download/" + user.profilePicture
                    : PF + "person/NoAvatarProfile.png"
                }
                className="postProfileImage"
                alt=""
              />
            </Link>
            <Link to={`profile/${user.username}`}>
              <span className="postUsername">{user.username}</span>
            </Link>
            <span className="postDate">{format(currentPost.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert
              className="postTopIcon"
              onClick={() => setShowOption(!showOption)}
            />
            {showOption ? (
              <div className="optionsss">
                <span className="option1" onClick={updateHandler}>
                  Update
                </span>
                <span className="option1" onClick={deleteHandler}>
                  Delete
                </span>
                <hr />
                <span className="option1">More</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="postCenter">
          {isUpdating ? (
            <form onSubmit={updatePost}>
              <input
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
                type="text"
                id="desc"
                className="shareInput"
              />
              {hasImage && (
                <div className="shareImgContainer">
                  <img
                    className="shareImg"
                    src={
                      currentPost.image
                        ? SI + "download/" + currentPost.image
                        : ""
                    }
                    alt=""
                  />
                  <Cancel
                    className="shareCancelImg"
                    onClick={() => setHasImage("")}
                  />
                </div>
              )}
              <button className="updateButton" type="submit">
                Update
              </button>
            </form>
          ) : (
            <>
              <span className="postText">{currentPost?.desc}</span>
              <br />
              <br />
              {post.tags.length > 0 && "With :"}
              {post.tags?.length > 0 &&
                post.tags?.map((tag) => {
                  return (
                    <Link key={tag._id} to={"/profile/" + tag.username}>
                      <span className="postTag">{tag.username}</span>
                    </Link>
                  );
                })}
              <img
                src={
                  currentPost.image ? SI + "download/" + currentPost.image : ""
                }
                className="postImage"
                alt=""
                loading="lazy"
                onClick={downloadImage}
              />
            </>
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {/* <img
              src={`${PF}like.png`}
              alt=""
              onClick={() => likeHandler(1)}
              className="likeIcon"
            /> */}
            <img
              src={`${PF}${isLiked ? "fillHeart.svg" : "emptyHeart.svg"}`}
              alt=""
              onClick={likeHandler}
              className="likeIcon"
            />
            <span className="postLikeCounter">{like} people liked it</span>
          </div>
          <div className="postBottomRight">
            <div className="postCommentText" onClick={showCommentHandler}>
              {commentLength} comments
            </div>
          </div>
        </div>
        {showComments ? (
          <CommentBox
            handleNotification={handleNotification}
            user={currentUser}
            postId={currentPost._id}
            setCommentLength={setCommentLength}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Post;
