import { Home, Profile, Login, Register, Messenger } from "./pages";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthContext } from "./context/AuthContext";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import axios from "axios";
const queryClient = new QueryClient();

function App() {
  const { accessToken, dispatch } = useContext(AuthContext);
  const [cookies] = useCookies(["jwt"]);
  const { jwt, user } = cookies;

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState(null);
  const [myInterests, setMyInterests] = useState([]);
  const [gender, setGender] = useState("");
  const [relation, setRelation] = useState("");

  useEffect(() => {
    if (accessToken === "") {
      if (jwt) dispatch({ type: "ACCESS_TOKEN", payload: { user, jwt } });
    }
  }, [dispatch, accessToken, jwt, user]);

  const API_endpoint = "https://us1.locationiq.com/v1/reverse.php?";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        setLatitude(position?.coords.latitude);
        setLongitude(position?.coords.longitude);

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

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={jwt ? <Home /> : <Navigate to="/login" />} />
          <Route
            path="/login"
            element={jwt ? <Navigate to="/" /> : <Login address={address} />}
          />
          <Route
            path="/register"
            element={jwt ? <Home /> : <Register address={address} />}
          />
          <Route
            path="/messenger"
            element={!jwt ? <Navigate to="/" /> : <Messenger />}
          />
          <Route
            path="/profile/:username"
            element={jwt ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
