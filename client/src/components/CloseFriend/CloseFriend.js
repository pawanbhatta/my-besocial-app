import "./styles.css";

function Friend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  return (
    <li className="sidebarFriend">
      <img
        src={
          user.profilePicture
            ? SI + "download/" + user.profilePicture
            : PF + "person/NoAvatarProfile.png"
        }
        className="sidebarFriendImage"
        alt=""
      />

      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}

export default Friend;
