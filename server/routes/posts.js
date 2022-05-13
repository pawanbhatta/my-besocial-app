const router = require("express").Router();
const postController = require("../controllers/postController");
const isAuthenticated = require("../middlewares/auth");
const isAuthorized = require("../middlewares/auth");

// GET TIMELINE POSTS
router.get("/timeline", isAuthenticated, postController.timelinePosts);

// GET user's all POSTS
router.get("/profile/:username", isAuthenticated, postController.profilePosts);

// GET user's POSTS of particular TYPE
router.get("/category", isAuthenticated, postController.getPostsOfType);

// CREATE A POST
router.post("/", isAuthenticated, postController.create);

// Get search results
router.get("/searchData", isAuthenticated, postController.getSearchData);

// UPDATE A POST
router.put("/:id", isAuthenticated, postController.update);

// DELETE A POST
router.delete("/:id", isAuthenticated, postController.delete);

// LIKE / DISLIKE A POST
router.put("/:id/like", isAuthenticated, postController.react);

// GET A POST
router.get("/:id", isAuthenticated, postController.getPost);

module.exports = router;
