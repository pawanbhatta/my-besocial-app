import "./styles.css";

function Online({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImageContainer">
        <img
          src={
            user.profilePicture
              ? SI + "download/" + user.profilePicture
              : PF + "person/NoAvatarProfile.png"
          }
          alt=""
          className="rightbarProfileImage"
        />
        <span className="rightbarOnlineBadge"></span>
      </div>
      <span className="rightbarUsername">{user.username}</span>
    </li>
  );
}

export default Online;
