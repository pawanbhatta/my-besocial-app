import { Home, Profile, Login, Register, Messenger } from "./pages";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthContext } from "./context/AuthContext";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
const queryClient = new QueryClient();

function App() {
  const { accessToken, dispatch } = useContext(AuthContext);
  const [cookies] = useCookies(["jwt"]);
  const { jwt, user } = cookies;

  useEffect(() => {
    if (accessToken === "") {
      if (jwt) dispatch({ type: "ACCESS_TOKEN", payload: { user, jwt } });
    }
  }, [dispatch, accessToken, jwt, user]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={jwt ? <Home /> : <Navigate to="/login" />} />
          <Route
            path="/login"
            element={jwt ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/register" element={jwt ? <Home /> : <Register />} />
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
