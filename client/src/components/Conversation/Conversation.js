import React from "react";
import "./conversation.css";

function Conversation() {
  return (
    <div className="conversation">
      <img
        src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
        alt=""
        className="conversationImg"
      />
      <span className="conversationName">Pawan Bhatta</span>
    </div>
  );
}

export default Conversation;
