const router = require("express").Router();
const messageController = require("../controllers/messageController");

// Add a message
router.post("/", messageController.create);

// Get messages of a conversation
router.get("/:conversationId", messageController.getMessages);

module.exports = router;
