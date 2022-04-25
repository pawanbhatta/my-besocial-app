import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./conversation.css";

function Conversation({ conversation, currentUser }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.filter((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios.get("/users/profile/?userId=" + friendId[0]);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser._id, conversation]);

  return user ? (
    <div className="conversation">
      <img
        src={
          user.profilePicture
            ? SI + "download/" + user.profilePicture
            : PF + "person/NoAvatarProfile.png"
        }
        className="conversationImg"
      />
      <span className="conversationName">{user.username}</span>
    </div>
  ) : (
    ""
  );
}

export default Conversation;
