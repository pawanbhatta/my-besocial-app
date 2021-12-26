import { useParams } from "react-router";
import { Topbar, Sidebar, Feed } from "../../components";
import HomeRightbar from "../../components/Rightbar/HomeRightbar";
import ProfileRightbar from "../../components/Rightbar/ProfileRightbar";
import "./styles.css";

function Home() {
  const { username } = useParams();

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        {username && <ProfileRightbar username={username} />}
        <HomeRightbar />
      </div>
    </>
  );
}

export default Home;
