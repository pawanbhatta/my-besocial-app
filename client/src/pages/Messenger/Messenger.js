import React from "react";
import {
  ChatOnline,
  Conversation,
  Message,
  Navbar,
} from "../../components/index";
import "./messenger.css";

function Messenger() {
  return (
    <>
      <Navbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatBoxTop" style={{ overflowY: "scroll" }}>
              <Message />
              <Message own={true} />
              <Message />
              <Message own={true} />
              <Message />
              <Message />
              <Message own={true} />
              <Message />
              <Message />
              <Message own={true} />
              <Message />
              <Message />
              <Message own={true} />
              <Message />
              <Message />
              <Message own={true} />
            </div>
            <div className="chatBoxBottom">
              <textare
                placeholder="Write message"
                className="chatMessageInput"
              ></textare>
              <button className="chatSubmitButton">Send</button>
            </div>
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;
