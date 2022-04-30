const router = require("express").Router();
const commentController = require("../controllers/commentController");
const isAuthenticated = require("../middlewares/auth");

// Get all comments of a COMMENT
router.get("/:postId", isAuthenticated, commentController.getComments);

// CREATE A COMMENT
router.post("/", isAuthenticated, commentController.create);

// UPDATE A COMMENT
router.put("/:id", isAuthenticated, commentController.update);

// DELETE A COMMENT
router.delete("/:id", isAuthenticated, commentController.delete);

// LIKE / DISLIKE A COMMENT
router.put("/:id/like", isAuthenticated, commentController.react);

module.exports = router;
