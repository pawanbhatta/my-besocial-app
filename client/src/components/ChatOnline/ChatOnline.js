import axios from "axios";
import React, { useEffect, useState } from "react";
import "./chatonline.css";

function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const { data } = await axios.get("/users/friends/" + currentId);
      setFriends(data);
    };
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const { data } = await axios.get(
        `/conversations/find/${currentId}/${user._id}`
      );
      if (data === null) {
        const res = await axios.post("/conversations", {
          senderId: currentId,
          receiverId: user._id,
        });
        setCurrentChat(res.data);
      } else {
        setCurrentChat(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => {
        return (
          <div
            className="chatOnlineFriend"
            key={o._id}
            onClick={() => handleClick(o)}
          >
            <div className="chatOnlineImgContainer">
              <img
                src={
                  o?.profilePicture
                    ? SI + "download/" + o.profilePicture
                    : PF + "person/NoAvatarProfile.png"
                }
                alt=""
                className="chatOnlineImg"
              />
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{o?.username}</span>
          </div>
        );
      })}
    </div>
  );
}

export default ChatOnline;
