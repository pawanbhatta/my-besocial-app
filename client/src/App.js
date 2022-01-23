import { Home, Profile, Login, Register } from "./pages";
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

  useEffect(() => {
    if (accessToken === "") {
      const { jwt, user } = cookies;

      if (jwt) dispatch({ type: "ACCESS_TOKEN", payload: { user, jwt } });
    }
  }, [dispatch, accessToken, cookies]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={accessToken ? <Home /> : <Login />} />
          <Route
            path="/login"
            element={accessToken ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={accessToken ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/profile/:username"
            element={accessToken ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
