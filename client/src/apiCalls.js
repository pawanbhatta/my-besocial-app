import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const loginCall = async (userCredentials, dispatch) => {
  // dispatch({ type: "LOGIN_START" });

  try {
    const { data } = await api.post("/auth/login", userCredentials);
    return data;
    // dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    throw Error(err.response.data.message);
    // dispatch({ type: "LOGIN_FAILURE", payload: err.response.data.message });
  }
};

export const signupCall = async (userInfo, dispatch) => {
  // dispatch({ type: "SIGNUP_START" });

  try {
    console.log("signup call", userInfo);
    const res = await api.post("/auth/register", userInfo);
    console.log("response data", res);
    return res.data;
    // dispatch({ type: "SIGNUP_SUCCESS", payload: res.data });
  } catch (err) {
    console.log("hhere", err);
    throw Error(err);

    // dispatch({ type: "SIGNUP_FAILURE", payload: err.response.data.message });
  }
};

export const refreshTokenCall = async (token, dispatch) => {
  dispatch({ type: "REFRESH_TOKEN" });

  try {
    const res = await axios.post("/auth/refresh", token);
    dispatch({ type: "REFRESH_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "REFRESH_FAILURE", payload: err.response.data.message });
  }
};

export const followCall = async (userIds, dispatch) => {
  try {
    await axios.put("/users/" + userIds.followId + "follow", {
      userId: userIds.userId,
    });
    dispatch({ type: "FOLLOW", payload: userIds.followId });
  } catch (error) {
    console.log("Error occurred while following", error.response.data.message);
  }
};

export const unfollowCall = async (userIds, dispatch) => {
  try {
    await axios.put("/users/" + userIds.followId + "unfollow", {
      userId: userIds.userId,
    });
    dispatch({ type: "UNFOLLOW", payload: userIds.followId });
  } catch (error) {
    console.log(
      "Error occurred while unfollowing",
      error.response.data.message
    );
  }
};
