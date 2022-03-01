import React from "react";
import "./chatonline.css";

function ChatOnline() {
  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img
            src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
            alt=""
            className="chatOnlineImg"
          />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">Kamal Bhatta</span>
      </div>
    </div>
  );
}

export default ChatOnline;
