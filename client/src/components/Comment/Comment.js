import React, { useState } from "react";
import "./comment.css";
import axios from "axios";

function Comment({ user, comment }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const [like, setLike] = useState(comment.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const likeHandler = async () => {
    try {
      await axios.put(`/comments/${comment._id}/like`, {
        userId: user._id,
      });
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className="comment">
      <div className="commentField">
        <img
          src={
            user.profilePicture
              ? SI + "download/" + user.profilePicture
              : PF + "person/NoAvatarProfile.png"
          }
          alt=""
          className="profileImage"
        />
        <div className="commentData">{comment.comment}</div>
      </div>
      <div className="postBottom">
        <div className="postBottomLeft">
          <img
            src={`${PF}heart.png`}
            alt=""
            onClick={likeHandler}
            className="likeIcon"
          />
          <span className="postLikeCounter">{like} people liked it</span>
        </div>
      </div>
    </div>
  );
}

export default Comment;
