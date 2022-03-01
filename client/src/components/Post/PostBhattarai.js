// import { ReactComponent as FbLogo } from "@assets/logos/facebook.svg";
// import { ReactComponent as LinkLogo } from "@assets/logos/Link.svg";
// import { ReactComponent as ShareLogo } from "@assets/logos/share.svg";
// import { ReactComponent as Dots3 } from "@assets/logos/3dots.svg";
// import { ReactComponent as DownLogo } from "@assets/logos/down.svg";
// import { ReactComponent as UpLogo } from "@assets/logos/up.svg";
// import { ReactComponent as LikeLogo } from "@assets/logos/love.svg";
// import { ReactComponent as LikedLogo } from '@assets/logos/love.svg'
import Dropdown from "./DropDown";
import { useContext, useEffect, useRef, useState } from "react";
// import { AuthContext } from "../../context/auth.context";
import "./post.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import useActions from "../../context/useActions";
import List from "./List";
import { AuthContext } from "../../context/AuthContext";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

function PostDetails({ post, onClick, detailToggle, deletePost, reactToPost }) {
  const navigateTo = useNavigate();
  const [cookies] = useCookies(["user"]);
  const createdDate = new Date(post.createdAt).toDateString();
  const description = useRef();
  const [likes, setLikes] = useState(post.likes);
  const liked = () => likes.includes(cookies.user._id);
  const { foundError } = useActions(AuthContext);
  const likeHandler = async () => {
    try {
      if (liked()) setLikes((l) => l.filter((l) => l !== cookies.user._id));
      else setLikes([...likes, cookies.user._id]);
      await axios.put(`/api/posts/${post._id}/like`, {
        userId: cookies.user._id,
      });
      reactToPost(!liked, post._id);
    } catch (err) {
      if (liked()) setLikes((l) => l.filter((l) => l !== cookies.user._id));
      else setLikes([...likes, cookies.user._id]);
      console.log(err);
      foundError(err);
    }
  };
  const postEditHandler = () => {
    navigateTo("/post/edit/" + post._id);
  };
  const postDeleteHandler = async () => {
    if (window.confirm("Are you sure you want to delete this post?") === false)
      return;
    try {
      await axios.delete(`/api/posts/${post._id}`, {
        userId: cookies.user._id,
      });
      deletePost(post._id);
    } catch (err) {
      console.log(err);
      foundError(err);
    }
  };
  const toggleDescription = () => {
    description.current.classList.toggle("clicked");
  };
  useEffect(() => {
    toggleShowDetails(false);
    setLikes(post.likes);
  }, [post]);
  // const details = useRef();
  const [showDetails, changeShowDetails] = useState(false);
  const [activeDetail, setActive] = useState(0);
  const toggleShowDetails = (boo) => {
    changeShowDetails((s) => boo);
    // setInterval(() => { if (showDetails) commentInput.current.focus() }, 100);
  };
  const toggleComments = () => {
    toggleShowDetails(true);
    setActive(1);
  };
  const toggleLikes = () => {
    toggleShowDetails(true);
    setActive(0);
  };
  const commentInput = useRef();
  const onEnter = (e) => {
    e.preventDefault();
    commentInput.current.value = "";
  };

  return (
    <>
      <div
        style={{ height: "max-content" }}
        className="desc glassModel dark"
        ref={description}
        onClick={toggleDescription}
      >
        <p>{post.desc}</p>
        <div style={{ fontSize: ".65em" }}>{createdDate}</div>
      </div>
      <div
        style={{ height: "max-content", position: "relative" }}
        className="glassModel dark"
      >
        <div className="post">
          <span
            onClick={likeHandler}
            className={liked() ? "liked hover-white" : "hover-white"}
          >
            {/* <LikeLogo /> */}
            <img src={`${PF}/logos/love.svg`} alt="" className="likeIcon" />
          </span>
          <span className="commentNum hover-white" onClick={toggleComments}>
            {!!post.comments ? post.comments.length : 0} Comments
          </span>
          <Dropdown className={"share"}>
            <Dropdown.Visible>
              {/* <ShareLogo /> */}
              <img src={`${PF}/logos/share.svg`} alt="" className="likeIcon" />
            </Dropdown.Visible>
            <Dropdown.Focus className={"glassModel dark items"} bottom center>
              <div className="fb hover-white">
                {/* <FbLogo fill="#0000ff" /> */}
                <img
                  src={`${PF}/logos/facebook.svg`}
                  alt=""
                  className="likeIcon"
                />
                Share via <strong>FaceBook</strong>
              </div>
              <div className="lk hover-white">
                {/* <LinkLogo fill="#0000ff" /> */}
                <img src={`${PF}/logos/Link.svg`} alt="" className="likeIcon" />
                Share via <strong>Link</strong>
              </div>
            </Dropdown.Focus>
          </Dropdown>
          <Dropdown className={"options"}>
            <Dropdown.Visible>
              {/* <Dots3 /> */}
              <img src={`${PF}/logos/3dots.svg`} alt="" className="likeIcon" />
            </Dropdown.Visible>
            <Dropdown.Focus className={"glassModel dark items"} bottom end>
              {cookies.user._id === post.userId ? (
                <ul style={{ paddingRight: ".5em" }}>
                  <li className="hover-dark" onClick={postDeleteHandler}>
                    Delete Post
                  </li>
                  <li className="hover-dark" onClick={postEditHandler}>
                    Edit Post
                  </li>
                </ul>
              ) : (
                <ul style={{ paddingRight: ".5em" }}>
                  <li className="hover-dark" onClick={onClick}>
                    Hide Post
                  </li>
                  <li className="hover-dark" onClick={onClick}>
                    Report Post
                  </li>
                </ul>
              )}
            </Dropdown.Focus>
          </Dropdown>
          <span
            className="showDesc hover-white"
            onClick={() => toggleShowDetails(!showDetails)}
          >
            {/* {showDetails ? <UpLogo /> : <DownLogo />} */}
            {showDetails ? (
              <img src={`${PF}/logos/up.svg`} alt="" className="likeIcon" />
            ) : (
              <img src={`${PF}/logos/down.svg`} alt="" className="likeIcon" />
            )}
          </span>
        </div>
        {showDetails && (
          <div className="details glassModel dark">
            <div className="detail-tabGroup">
              <List className="horizontal">
                <li onClick={toggleLikes}>Likes</li>
                <li onClick={toggleComments}>Comments</li>
                <li
                  style={{ flex: ".4" }}
                  onClick={() => toggleShowDetails(false)}
                >
                  x
                </li>
              </List>
            </div>
            <div className="detail-post">
              {!activeDetail ? (
                <div className="likedBy">
                  {!likes.length ? (
                    "No Likes yet.. "
                  ) : (
                    <ul>
                      {likes.map((x, i) => (
                        <li key={i}>@{x}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="comments" tabIndex={0}>
                  {!!post.comments ? (
                    <>
                      <div className="show">
                        {!post.comments.length ? (
                          "Zero Comments present in DB"
                        ) : (
                          <ul>
                            {post.comments.map((x, i) => (
                              <li key={i}>
                                <strong>@{x.username}</strong>: {x.comment}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </>
                  ) : (
                    "No Comments to show"
                  )}
                </div>
              )}
            </div>
            <form
              className="add normform"
              style={{ fontSize: "1rem" }}
              onSubmit={onEnter}
            >
              <input
                placeholder="Add a Comment"
                type="text"
                name="comment"
                id="name"
                ref={commentInput}
              />
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default PostDetails;
