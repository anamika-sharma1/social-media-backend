const Conversation = require("../models/conversationSchema");

const createConversation = async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = newConversation.save();
    res.status(200).json(newConversation);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getConversation = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json(error);
  }
};

const findConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { createConversation, getConversation, findConversation };
