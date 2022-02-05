import "./styles.css";

function Friend({ user }) {
  return (
    <li className="sidebarFriend">
      <img src={user.profilePicture} alt="" className="sidebarFriendImage" />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}

export default Friend;
