const router = require("express").Router();
const conversationController = require("../controllers/conversationController");
const Conversation = require("../models/Conversation");

// Get all conversations
router.get("/", conversationController.getAllConversations);

// Create a new conversation
router.post("/", validateConversation, conversationController.create);

// Get all conversations of a user
router.get("/:userId", conversationController.getConversation);

// Delete a conversation
router.delete("/", conversationController.delete);

async function validateConversation(req, res, next) {
  try {
    console.log("req.body", req.body);
    const conversations = await Conversation.find({
      members: [req.body.senderId, req.body.receiverId],
    });
    console.log("conversations", conversations.length);
    if (conversations.length == 1)
      return res.status(400).json("Conversation already available");
    next();
  } catch (error) {
    res.status(500).send({ Error: "Error occurred" });
  }
}

module.exports = router;
