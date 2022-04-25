const Conversation = require("../models/Conversation");

const conversationController = {
  index: async (req, res) => {
    try {
      const conversations = await Conversation.find();
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).send("Server Error:", error);
    }
  },

  create: async (req, res) => {
    console.log("convo", req.body);
    if (!req.body.senderId || !req.body.receiverId) {
      throw res.status(204).send("Send both sender and receiver IDs");
    }
    const conversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    try {
      const savedConversation = await conversation.save();
      res.status(200).json(savedConversation);
    } catch (error) {
      res.status(500).send("Server Error : " + error);
    }
  },

  // To get the current chat conversation
  getConversation: async (req, res) => {
    try {
      console.log("req.params");
      const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).send("Server Error: ", error);
    }
  },

  // To get all the chats list
  getAllConversations: async (req, res) => {
    try {
      console.log("req.params", req.params);
      const conversations = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      console.log("found", conversations);
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).send("Server Error: ", error);
    }
  },

  getTwoUsersConversation: async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).send("Server Error: ", error);
    }
  },

  delete: async (req, res) => {
    console.log(req.body);
    const conversation = await Conversation.findById(req.body.convId);

    if (!conversation) return res.status(404).json("Conversation not found");

    await conversation.remove();
    res.status(200).json("Conversation deleted successfully");
  },
};

module.exports = conversationController;
