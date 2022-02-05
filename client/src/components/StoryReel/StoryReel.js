import "./StoryReel.css";
import { Story } from "../index";
import { Users } from "../../dummyData";
import { Helmet } from "react-helmet";

function StoryReel() {
  return (
    <div className="storyReel">
      <div className="storyreelWrapper">
        <div className="storyList" id="storyList">
          {Users.map((u) => (
            <Story key={u.id} user={u} className="story" />
          ))}
        </div>
        <i className="fas fa-angle-right arrow" id="arr"></i>
      </div>
      <Helmet>
        <script src="./app.js" type="text/javascript"></script>
      </Helmet>
    </div>
  );
}

export default StoryReel;
