import "./styles.css";
import { Users } from "../../dummyData";
import { Online } from "../index";

function HomeRightbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <div className="birthdayContainer">
          <img src={`${PF}gift.png`} alt="" className="birthdayImage" />
          <span className="birthdayText">
            <b>Puskar Raj Joshi</b> and <b> 3 other friends </b> have birthday
            today
          </span>
        </div>
        <img src={`${PF}ad.png`} alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HomeRightbar;
