const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../services/CustomErrorHandler");

let refreshTokens = [];

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, "myjsonsecret", {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, "myrefreshjsonsecret");
};

const authController = {
  register: async (req, res, next) => {
    try {
      // GENERATE HASHED PASSWORD
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const userExist = await User.findOne({ email: req.body.email });
      console.log("user exist", userExist);
      if (userExist) {
        // throw Error("User with given email already exists");
        return next(
          CustomErrorHandler.alreadyExist(
            "User with given email already exists"
          )
        );
      }

      // CREATE NEW USER
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      // SAVE USER AND RESPOND
      const user = await newUser.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      refreshTokens.push(refreshToken);

      return res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
      console.log("error :>> ", error);
      // throw Error(error);

      // return next(CustomErrorHandler.serverError());
    }
  },

  login: async (req, res, next) => {
    console.log("logni here");
    try {
      console.log("req.body login", req.body);
      const user = await User.findOne({ email: req.body.email });

      console.log("user found", user);
      if (!user)
        return next(
          CustomErrorHandler.notFound("User with given username Not Found")
        );

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword)
        return next(CustomErrorHandler.wrongCredentials(400, "Wrong Password"));

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      refreshTokens.push(refreshToken);

      return res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
      console.log("error :>> ", error);
      return next(new CustomErrorHandler.serverError());
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.body.token;

      if (!refreshToken) return next(CustomErrorHandler.unAuthenticated());

      if (!refreshTokens.includes(refreshToken))
        return next(
          CustomErrorHandler.unAuthenticated("Refresh Token is not valid")
        );

      const user = await jwt.verify(refreshToken, "myrefreshjsonsecret");

      if (!user) return next(CustomErrorHandler.unAuthenticated());

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      refreshTokens.push(newRefreshToken);

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      return next(CustomErrorHandler.serverError(err));
    }
  },

  logout: async (req, res, next) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    res.status(200).json("Logout Successful");
  },
};

module.exports = authController;
