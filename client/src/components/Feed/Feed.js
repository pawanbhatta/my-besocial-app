import { Share, Post, StoryReel } from "../index";
import "./styles.css";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router";

function Feed() {
  const [Posts, setPosts] = useState([]);
  const { user, accessToken } = useContext(AuthContext);
  const { username } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/posts/profile/" + username, {
            headers: { authorization: "Bearer " + accessToken },
          })
        : await axios.get("/posts/timeline?email=" + user.email, {
            headers: { authorization: "Bearer " + accessToken },
          });
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id, accessToken, user.email]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {/* <StoryReel/> */}
        {(!username || username === user.username) && <Share />}
        {Posts.length ? (
          Posts.map((p) => <Post key={p._id} post={p} />)
        ) : (
          <h1>No Posts Available</h1>
        )}
      </div>
    </div>
  );
}

export default Feed;
