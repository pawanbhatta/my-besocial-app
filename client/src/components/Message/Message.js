import React, { useEffect, useState } from "react";
import "./message.css";
import { format } from "timeago.js";
import axios from "axios";

const Message = ({ message, own, user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const [sender, setSender] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(
          `/users/profile/?userId=${message.sender}`
        );
        setSender(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);
  console.log("sender", sender);
  console.log("user", user);

  return message ? (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          src={
            own
              ? user.profilePicture
                ? SI + "download/" + user.profilePicture
                : PF + "person/NoAvatarProfile.png"
              : sender?.profilePicture
              ? SI + "download/" + sender?.profilePicture
              : PF + "person/NoAvatarProfile.png"
          }
          alt=""
          className="messageImg"
        />
        <p className="messageText">{message?.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  ) : (
    "No messages"
  );
};

export default Message;
