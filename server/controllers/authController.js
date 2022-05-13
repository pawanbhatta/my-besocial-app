const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../services/CustomErrorHandler");

let refreshTokens = [];

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, "myjsonsecret", {
    expiresIn: "1000m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, "myrefreshjsonsecret", {
    expiresIn: "1000m",
  });
};

const authController = {
  register: async (req, res, next) => {
    try {
      // GENERATE HASHED PASSWORD
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const userExist = await User.findOne({ email: req.body.email });

      if (userExist)
        throw res
          .status(409)
          .send(`User with Email : ${req.body.email} already exists!`);

      // CREATE NEW USER
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        city: req.body.city,
        from: req.body.from,
        desc: req.body.desc,
        gender: req.body.gender,
        relation: req.body.relation,
        interests: req.body.myInterests,
      });

      // SAVE USER AND RESPOND
      const user = await newUser.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      refreshTokens.push(refreshToken);

      return res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
      res.status(500).send("Server Error");
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user)
        throw res.status(401).send("User with this username doesnot exist.");

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword)
        throw res.status(401).send("Password didn't match! Try again");

      // return next(CustomErrorHandler.wrongCredentials(400, "Wrong Password"));

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      refreshTokens.push(refreshToken);

      try {
        await User.findByIdAndUpdate(user._id, {
          $set: req.body,
        });
        return res.status(200).json("Account has been updated");
      } catch (error) {
        return res.status(500).json(error);
      }

      return res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
      console.log("error :>> ", error);
    }
  },

  refreshToken: async (req, res) => {
    try {
      console.log(req.body);
      const refreshToken = req.body.token;

      if (!refreshToken) {
        console.log("first error", refreshToken);
        throw res.status(401).send("You are not authenticated");
      }

      if (!refreshTokens.includes(refreshToken)) {
        console.log("invalid refresh token");
        throw res.status(401).send("Invalid refresh token");
      }
      const user = await jwt.verify(refreshToken, "myrefreshjsonsecret");

      if (!user) {
        console.log("got no user error", user, refreshToken);
        throw res.status(401).send("Absolutely not authenticated");
      }

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      refreshTokens.push(newRefreshToken);

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      return res.status(500).send("Server Error");
    }
  },

  logout: async (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    res.status(200).json("Logout Successful");
  },
};

module.exports = authController;
