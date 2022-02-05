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

      const user = await User.findOne({ username: username }).select(
        "-_v -password -isAdmin -createdAt -updatedAt"
      );
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId).select(
            "-_v -password -isAdmin -createdAt -updatedAt"
          );
        })
      );
      res.status(200).json(friends);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const username = req.query.username;

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

  follow: async (req, res) => {
    if (req.body.userId !== req.params.id) {
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
          return res.status(200).json("User has been followed");
        } else {
          return res.status(403).json("You have already followed this user");
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
          return res.status(200).json("User has been unfollowed");
        } else {
          return res.status(403).json("You dont follow this user");
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
