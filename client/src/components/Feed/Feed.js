import { Share, Post, StoryReel } from "../index";
import "./styles.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router";
import FeedType from "../FeedType/FeedType";

function Feed({ socket }) {
  const [Posts, setPosts] = useState([]);
  const [type, setType] = useState("All");
  const [cookies] = useCookies(["jwt", "user"]);
  const { user, jwt: accessToken } = cookies;
  const { username } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res =
          type === "All"
            ? username
              ? await axios.get("/posts/profile/" + username, {
                  headers: { authorization: "Bearer " + accessToken },
                })
              : await axios.get("/posts/timeline?email=" + user.email, {
                  headers: { authorization: "Bearer " + accessToken },
                })
            : await axios.get(`/posts/category?type=${type}`);
        setPosts(
          res.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, [username, user._id, accessToken, user.email, type]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {/* <StoryReel/> */}
        {(!username || username === user.username) && <Share />}
        {(!username || username === user.username) && (
          <FeedType setType={setType} />
        )}

        {Posts.length ? (
          Posts.map((p) => <Post key={p._id} post={p} socket={socket} />)
        ) : (
          <h1 className="noPost">No Posts Available</h1>
        )}
      </div>
    </div>
  );
}

export default Feed;
