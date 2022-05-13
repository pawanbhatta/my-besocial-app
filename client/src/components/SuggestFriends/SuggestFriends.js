import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "./suggestFriends.css";

function SuggestFriends() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const SI = process.env.REACT_APP_GET_IMAGES;

  const [cookies, setCookie] = useCookies(["jwt", "user"]);
  const { user: currentUser } = cookies;

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState(null);
  const [suggestType, setSuggestType] = useState("friends");
  const [suggestions, setSuggestions] = useState([]);

  const API_endpoint = "https://us1.locationiq.com/v1/reverse.php?";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        let finalAPI = `${API_endpoint}key=${process.env.REACT_APP_MAP_PRIVATE_KEY}&lat=${latitude}&lon=${longitude}&format=json`;

        const { data } = await axios.get(finalAPI);
        const { city, country, suburb } = data.address;
        const displayName = data.display_name
          .split(city)[0]
          .split(",")
          .slice(0, -1);

        setAddress({ city, suburb, country, displayName });
      },
      function (error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }, [latitude, longitude]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get(`/users/mutual/followers/suggestions`);
      setSuggestions(data);
    };
    fetchUsers();
  }, []);

  const suggestHandler = (type) => {
    if (type === "friends") {
      suggestByMutualFriends();
    } else if (type === "nearby") {
      friendsNearby();
    } else {
      suggestByInterests();
    }
  };

  const suggestByMutualFriends = async () => {
    try {
      const { data } = await axios.get(`/users/mutual/followers/suggestions`);
      setSuggestions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const friendsNearby = async () => {
    try {
      const { data } = await axios.get("/users/nearby/location/suggestions");
      setSuggestions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const suggestByInterests = async () => {
    try {
      const { data } = await axios.get("/users/mutual/interests/suggestions");
      setSuggestions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const followUser = async (user) => {
    const { data } = await axios.put(`/users/${user._id}/follow`, {
      userId: currentUser._id,
    });
    setCookie("user", data.updatedUser, { secure: true, sameSite: "None" });
    setSuggestions((prev) => prev.filter((p) => p._id !== user._id));
  };

  return (
    <div className="suggestion">
      <div className="suggestWrapper">
        <div className="suggestTop">
          <h1 className="suggestTopic">Suggestions by </h1>
          <div className="suggestTypes">
            <div
              className="suggestType"
              onClick={() => suggestHandler("friends")}
            >
              <button>Mutual Friends</button>
            </div>
            <div
              className="suggestType"
              onClick={() => suggestHandler("nearby")}
            >
              <button>NearBy Location</button>
            </div>
            <div
              className="suggestType"
              onClick={() => suggestHandler("interest")}
            >
              <button>Mutual Interests</button>
            </div>
          </div>
        </div>
        <hr className="suggestDivider" />
        <div className="suggestMutual">
          <div className="suggestMutualBottom">
            {suggestions.length > 0
              ? suggestions.map((s) => {
                  return (
                    <div key={s?._id} className="suggest">
                      <div className="suggestTop">
                        <img
                          src={
                            s.coverPicture
                              ? SI + "download/" + s.coverPicture
                              : PF + "person/defaultCover.png"
                          }
                          alt="CoverImage"
                          className="imageCover"
                        />
                        <img
                          src={
                            s.profilePicture
                              ? SI + "download/" + s.profilePicture
                              : PF + "person/NoAvatarProfile.png"
                          }
                          alt="ProfileImage"
                          className="imageProfile"
                        />
                      </div>
                      <div className="suggestBottom">
                        <span className="suggestUsername">{s.username}</span>
                        <p className="descrip">5 Mutual friends</p>
                        <div className="suggestFollowBtn">
                          <button onClick={() => followUser(s)}>Follow</button>
                        </div>
                      </div>
                    </div>
                  );
                })
              : "No Suggestions"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuggestFriends;
