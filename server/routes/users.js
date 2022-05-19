const router = require("express").Router();
const userController = require("../controllers/userController");
const isAuthenticated = require("../middlewares/auth");
// const isPermitted = require("../middlewares/auth");

// UPDATE USER
router.put("/:id", [isAuthenticated], userController.updateProfile);

// DELETE USER
router.delete("/:id", [isAuthenticated], userController.delete);

// GET A USER
router.get("/profile", [isAuthenticated], userController.getUser);

// Get friends
router.get("/friends/:userId", isAuthenticated, userController.getFriends);

// Get tagged friends
router.get("/tagged/friends", isAuthenticated, userController.getTaggedFriends);

// Get all users
router.get("/all", isAuthenticated, userController.getAllUsers);

// suggest by mutual followers
router.get(
  "/mutual/followers/suggestions",
  isAuthenticated,
  userController.getMutualFriends
);

// suggest by nearby location
router.get(
  "/nearby/location/suggestions",
  isAuthenticated,
  userController.friendsNearby
);

// suggest by mututal interests
router.get(
  "/mutual/interests/suggestions",
  isAuthenticated,
  userController.friendsByInterests
);

// FOLLOW A USER
router.put("/:id/follow", isAuthenticated, userController.follow);

// UNFOLLOW A USER
router.put("/:id/unfollow", isAuthenticated, userController.unFollow);

module.exports = router;
