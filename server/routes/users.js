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
router.get("/friends", isAuthenticated, userController.getFriends);

// Get all users
router.get("/all", isAuthenticated, userController.getAllUsers);

// FOLLOW A USER
router.put("/:id/follow", isAuthenticated, userController.follow);

// UNFOLLOW A USER
router.put("/:id/unfollow", isAuthenticated, userController.unFollow);

module.exports = router;
