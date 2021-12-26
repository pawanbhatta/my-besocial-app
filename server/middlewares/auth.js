const CustomErrorHandler = require("../services/CustomErrorHandler");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = isAuthenticated = async (req, res, next) => {
  try {
    console.log("is authenticated");

    const authHeader = req.headers.authorization;
    console.log("auth header", authHeader);

    if (!authHeader)
      return next(
        CustomErrorHandler.unAuthenticated("You are not authenticated")
      );

    const token = authHeader.split(" ")[1];
    console.log("auth token", token);

    const user = await jwt.verify(token, "myjsonsecret");
    if (!user)
      return next(CustomErrorHandler.unAuthenticated("Token is invalid"));
    console.log("auth user", user);

    const getUser = await User.findOne({ _id: user.id });

    req.user = getUser;
    return next();
  } catch (err) {
    return next(CustomErrorHandler.serverError(err));
  }
};

// module.exports = isAuthorized = async (req, res, next) => {
//   try {
//     console.log("is aurhorized");
//     const post = await Post.findById(req.params.id);

//     if (post.userId !== req.user.id)
//       return next(
//         CustomErrorHandler.unAuthorized(
//           "You are unauthorized to delete this post"
//         )
//       );

//     return next();
//   } catch (err) {
//     return next(CustomErrorHandler.serverError(err));
//   }
// };

// module.exports = isPermitted = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);
//     console.log("is permitted", user);
//     if (req.params.id !== req.user.id || user.isAdmin)
//       return next(
//         CustomErrorHandler.unAuthorized(
//           "You can update or remove only your account"
//         )
//       );

//     return next();
//   } catch (err) {
//     return next(CustomErrorHandler.serverError(err));
//   }
// };
