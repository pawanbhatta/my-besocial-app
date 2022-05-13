import React, { useEffect, useState } from "react";
import Comment from "../Comment/Comment";
import "./commentBox.css";
import axios from "axios";

function CommentBox({ user, postId, setCommentLength, handleNotification }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await axios.get(`/comments/${postId}`);
      setComments(data);
    };

    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const comment = {
      userId: user._id,
      postId,
      comment: newComment,
    };

    try {
      const { data } = await axios.post("/comments", comment);
      setComments([...comments, data]);
      setNewComment("");
      setCommentLength((prev) => prev + 1);
      handleNotification(2);
    } catch (error) {
      console.log(error);
    }
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      handleSubmit(e);
    }
  };

  return (
    <div className="commentBox">
      <div className="newComment">
        <img
          src={
            user.profilePicture
              ? SI + "download/" + user.profilePicture
              : PF + "person/NoAvatarProfile.png"
          }
          alt=""
          className="profileImage"
        />
        <input
          type="text"
          className="commentInput"
          placeholder="Wanna say something ?"
          onChange={(e) => setNewComment(e.target.value)}
          value={newComment}
          onKeyDown={onEnterPress}
          autoFocus
        />
      </div>
      <hr className="hr" />
      {comments?.length !== 0
        ? comments.map((c) => {
            return <Comment key={c._id} user={user} comment={c} />;
          })
        : ""}
    </div>
  );
}

export default CommentBox;
