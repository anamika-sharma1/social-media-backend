const Message = require("../models/messageSchema");

const createMessage = async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json(error);
  }
};
const getMessage = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { createMessage, getMessage };
