import React from "react";
import "./message.css";

function Message({ own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt=""
          className="messageImg"
        />
        <p className="messageText">
          Hello, this is a message Lorem ipsum dolor sit
        </p>
      </div>
      <div className="messageBottom">1 hour ago</div>
    </div>
  );
}

export default Message;
