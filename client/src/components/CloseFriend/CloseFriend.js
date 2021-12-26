import "./styles.css";

function Friend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <li className="sidebarFriend">
      <img
        src={PF + user.profilePicture}
        className="sidebarFriendImage"
        alt="CloseFriendImage"
      />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}

export default Friend;
