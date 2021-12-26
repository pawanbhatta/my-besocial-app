const router = require("express").Router();
const userController = require("../controllers/userController");
const isAuthenticated = require("../middlewares/auth");
const isPermitted = require("../middlewares/auth");

// UPDATE USER
router.put("/:id", [isAuthenticated], userController.update);

// DELETE USER
router.delete("/:id", [isAuthenticated], userController.delete);

// GET A USER
router.get("/", isAuthenticated, userController.getUser);

// Get friends
router.get("/friends", isAuthenticated, userController.getFriends);

// FOLLOW A USER
router.put("/:id/follow", isAuthenticated, userController.follow);

// UNFOLLOW A USER
router.put("/:id/unfollow", isAuthenticated, userController.unFollow);

module.exports = router;
