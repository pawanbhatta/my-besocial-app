const Message = require("../models/Message");

const messageController = {
  index: async (req, res) => {
    const messages = await Message.find();
    res.status(200).json(messages);
  },

  create: async (req, res) => {
    const message = new Message(req.body);
    console.log("message", req.body);
    try {
      const savedMessage = await message.save();
      res.status(200).json(savedMessage);
    } catch (error) {
      res.status(500).send("Server Error : " + error);
    }
  },

  getMessages: async (req, res) => {
    try {
      console.log("got here", req.params);
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).send("SErver Error : " + error);
    }
  },
};

module.exports = messageController;
