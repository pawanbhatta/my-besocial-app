import { Share, Post, StoryReel } from "../index";
import "./styles.css";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router";

function Feed() {
  const [Posts, setPosts] = useState([]);
  const [cookies] = useCookies(["jwt", "user"]);
  const { user, jwt: accessToken } = cookies;
  // const { user, accessToken } = useContext(AuthContext);
  const { username } = useParams();

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const fetchPosts = async () => {
      try {
        const res = username
          ? await axios.get(
              "/posts/profile/" + username,
              {
                cancelToken: source.token,
              },
              {
                headers: { authorization: "Bearer " + accessToken },
              }
            )
          : await axios.get("/posts/timeline?email=" + user.email, {
              headers: { authorization: "Bearer " + accessToken },
            });
        setPosts(
          res.data.sort((p1, p2) => {
            return new Date(p2.updatedAt) - new Date(p1.updatedAt);
          })
        );
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("successfully aborted");
        } else {
          console.log("server errrorr", error);
        }
      }
    };

    fetchPosts();

    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
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
