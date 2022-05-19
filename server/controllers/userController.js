const bcrypt = require("bcrypt");
const User = require("../models/User");

const userController = {
  update: async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (error) {
          return res.status(500).json(error);
        }
      }
      try {
        await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        return res.status(200).json("Account has been updated");
      } catch (error) {
        return res.status(500).json(error);
      }
    } else {
      return res.status(403).json("You can update only your account");
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      console.log("user", user);
      req.query.type === "profile"
        ? await user.update({
            $set: {
              profilePicture: req.body.profilePicture,
              profileImageId: req.body.profileImageId,
            },
          })
        : await user.update({
            $set: {
              coverPicture: req.body.coverPicture,
              coverImageId: req.body.coverImageId,
            },
          });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).send("Server Error!!");
    }
  },

  delete: async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        const user = await User.findByIdAndDelete(req.params.id);
        return res.status(200).json("Account has been deleted");
      } catch (error) {
        return res.status(500).json(error);
      }
    } else {
      return res.status(403).json("You can delete only your account");
    }
  },

  getUser: async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
      const user = userId
        ? await User.findOne({ _id: userId }).select(
            "-_v -password -isAdmin -createdAt -updatedAt"
          )
        : await User.findOne({ username: username }).select(
            "-_v -password -isAdmin -createdAt -updatedAt"
          );
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getFriends: async (req, res) => {
    try {
      const username = req.query.username;
      const userId = req.params.userId;

      const user = username
        ? await User.findOne({ username: username }).select(
            "-_v -password -isAdmin -createdAt -updatedAt"
          )
        : await User.findOne({ _id: userId }).select(
            "-_v -password -isAdmin -createdAt -updatedAt"
          );
      let friendList = [];
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId).select(
            "-_v -password -isAdmin -createdAt -updatedAt"
          );
        })
      );
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      res.status(200).json(friendList);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getTaggedFriends: async (req, res) => {
    try {
      const usernames = req.query.usernames.split(",");
      let friendList = [];
      let friends = await Promise.all(
        usernames.map(async (friendId) => {
          const user = await User.findOne({ username: friendId }).select(
            "-_v -password -isAdmin -createdAt -updatedAt"
          );

          return user;
        })
      );

      friends = friends.filter((f) => {
        if (f !== null) {
          return f._id !== req.user._id;
        } else return f;
      });

      friends.map((friend) => {
        if (friend !== null) {
          const { _id, username, profilePicture } = friend;
          friendList.push({ _id, username, profilePicture });
        } else {
          friendList.push(friend);
        }
      });

      res.status(200).json(friendList);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllUsers: async (req, res) => {
    const username = req.query.username;
    try {
      const allUsers = await User.find().select(
        "-_v -password -isAdmin -createdAt -updatedAt"
      );

      const users = await Promise.all(
        allUsers.filter((user) => user.username !== username)
      );
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getMutualFriends: async (req, res) => {
    try {
      const followings = await Promise.all(
        req.user.followings.map(async (u) => {
          return await User.findById(u);
        })
      );
      let suggestions = [];

      followings.map(async (f) => {
        const { followings } = f;
        suggestions.push(...followings);
      });

      suggestions = [...new Set(suggestions)];

      suggestions = suggestions.filter((s) => s !== req.user._id.toString());

      suggestions = suggestions.filter((s) => {
        console.log("test", !req.user.followings.includes(s));
        return !req.user.followings.includes(s);
      });

      const followSuggestions = await Promise.all(
        suggestions.map(async (s) => {
          return await User.findById(s);
        })
      );
      res.status(200).json(followSuggestions);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  friendsNearby: async (req, res) => {
    try {
      const followings = req.user.followings;
      const allUsers = await User.find({ city: req.user.city });
      const nearbyFriends = allUsers.filter(
        (u) => u._id.toString() !== req.user._id.toString()
      );
      const nearbySuggestions = nearbyFriends.filter(
        (f) => !followings.includes(f._id)
      );

      res.status(200).json(nearbySuggestions);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  friendsByInterests: async (req, res) => {
    try {
      let intCount = 0;
      let suggestions = [];
      const followings = req.user.followings;
      const allUsers = await User.find();
      const interestedUsers = allUsers.filter(
        (u) => u._id.toString() !== req.user._id.toString()
      );
      interestedUsers.map((f) => {
        if (!followings.includes(f._id)) {
          f.interests.map((i) => {
            if (req.user.interests.includes(i)) intCount++;
          });
          if (intCount > 4) suggestions.push(f);
        }
      });

      res.status(200).json(suggestions);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  follow: async (req, res) => {
    if (req.body.userId !== req.params.id) {
      let updatedUser;
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);

        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({
            $push: { followers: req.body.userId },
          });
          await currentUser.updateOne({
            $push: { followings: req.params.id },
          });
          updatedUser = await User.findById(currentUser._id);
          return res
            .status(200)
            .json({ message: "User has been followed", updatedUser });
        } else {
          updatedUser = await User.findById(user._id);

          return res.status(200).json({
            message: "You have already followed this user",
            updatedUser,
          });
        }
      } catch (error) {
        return res.status(500).json(error);
      }
    } else {
      return res.status(403).json("You cant follow yourself");
    }
  },

  unFollow: async (req, res) => {
    if (req.body.userId !== req.params.id) {
      let updatedUser;
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);

        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({
            $pull: { followers: req.body.userId },
          });
          await currentUser.updateOne({
            $pull: { followings: req.params.id },
          });
          updatedUser = await User.findById(currentUser._id);

          return res
            .status(200)
            .json({ message: "User has been unfollowed", updatedUser });
        } else {
          return res
            .status(200)
            .json({ message: "You dont follow this user", updatedUser });
        }
      } catch (error) {
        return res.status(500).json(error);
      }
    } else {
      return res.status(403).json("You cant follow or unfollow yourself");
    }
  },
};

module.exports = userController;
