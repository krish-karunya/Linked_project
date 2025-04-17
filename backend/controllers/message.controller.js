import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  const user = req.user;
  const senderId = user._id;
  const { id: receiverId } = req.params;

  try {
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      conversation.message.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json({ newMessage });
  } catch (error) {
    console.log("Error in sendMessage controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMessage = async (req, res) => {
  const user = req.user;
  const senderId = user._id;
  const { id: receiverId } = req.params;
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("message");

    if (!conversation) return res.status(200).json([]);

    const message = conversation.message;

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getMessage controller", error);
    res.status(500).json({ message: error.message });
  }
};
