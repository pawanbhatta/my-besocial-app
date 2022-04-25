import React from "react";
import "./Story.css";
import { Avatar } from "@material-ui/core";

function Story({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div
      style={{
        backgroundImage: `url(${
          user.coverPicture
            ? PF + user.coverPicture
            : PF + "person/defaultCover.png"
        })`,
      }}
      className="story"
    >
      <Avatar
        className="story__avatar"
        src={
          user.profilePicture
            ? PF + user.profilePicture
            : PF + "person/NoAvatarProfile.png"
        }
      />
      <h4>{user.username}</h4>
    </div>
  );
}

export default Story;
