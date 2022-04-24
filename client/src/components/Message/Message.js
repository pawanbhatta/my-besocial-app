import React from "react";
import "./message.css";
import { format } from "timeago.js";

const Message = ({ message, own }) => {
  return message ? (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img src="#" alt="" className="messageImg" />
        <p className="messageText">{message?.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  ) : (
    "No messages"
  );
};

export default Message;
