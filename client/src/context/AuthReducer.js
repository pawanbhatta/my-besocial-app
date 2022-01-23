const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        accessToken: "",
        refreshToken: "",
        isFetching: true,
        error: false,
      };

    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isFetching: false,
        error: "",
      };

    case "LOGIN_FAILURE":
      return {
        user: null,
        accessToken: "",
        refreshToken: "",
        isFetching: false,
        error: action.payload,
      };

    case "SIGNUP_START":
      return {
        accessToken: "",
        refreshToken: "",
        user: null,
        isFetching: true,
        error: false,
      };

    case "SIGNUP_SUCCESS":
      return {
        accessToken: "",
        refreshToken: "",
        user: action.payload,
        isFetching: false,
        error: false,
      };

    case "SIGNUP_FAILURE":
      return {
        accessToken: "",
        refreshToken: "",
        user: null,
        isFetching: false,
        error: action.payload,
      };

    case "ACCESS_TOKEN":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.jwt,
      };

    case "REFRESH_SUCCESS":
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };

    case "REFRESH_FAILURE":
      return {
        accessToken: "",
        refreshToken: "",
        user: null,
        isFetching: false,
        error: action.payload,
      };

    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };

    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };

    default:
      return state;
  }
};

export default AuthReducer;
