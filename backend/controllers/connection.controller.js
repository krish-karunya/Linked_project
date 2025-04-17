import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { Notification } from "../models/notification.model.js";

export const getAllConnection = async (req, res) => {
  const user = req.user;
  // console.log(user);

  try {
    const connectionList = await User.findOne({ _id: user._id }).populate(
      "connections",
      "userName profilePic headline"
    );

    res.status(200).json({ data: connectionList.connections });
  } catch (error) {
    console.log("Error in getAllConnection controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const sendConnection = async (req, res) => {
  const { receiverId } = req.params;
  const user = req.user;
  try {
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    if (user._id.toString() === receiverId.toString()) {
      return res.status(400).json({
        message: "You are not allowed to send connection to yourself",
      });
    }

    const receiver = await User.findOne({ _id: receiverId });

    if (!receiver) {
      return res.status(400).json({ message: "User Not Found" });
    }
    console.log("user Connection", user.connections);
    console.log(user.connections.includes(receiverId.toString()));

    const connection = await ConnectionRequest.findOne({
      $and: [
        {
          $or: [
            { sender: user._id, receiver: receiverId },
            { sender: receiverId, receiver: user._id },
          ],
        },

        { status: "pending" },
      ],
    });
    console.log("connection", connection);

    if (connection) {
      return res
        .status(400)
        .json({ message: "Connection Already in pending status" });
    }

    if (user.connections.includes(receiverId.toString())) {
      return res
        .status(400)
        .json({ message: "User Already there in your connection" });
    }

    const newConnection = new ConnectionRequest({
      sender: user._id,
      receiver: receiverId,
      status: "pending",
    });

    await newConnection.save();

    // creating Notifications :

    const newNotification = new Notification({
      senderId: user._id,
      receiverId: receiverId,
      notificationType: "connection",
      read: false,
    });

    await newNotification.save();

    res.status(201).json({
      message: `${user.userName} send connection to ${receiver.userName}`,
      data: newConnection,
    });
  } catch (error) {
    console.log("Error in sendConnection controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const acceptConnection = async (req, res) => {
  const { id: connectionId } = req.params;
  const user = req.user;
  try {
    if (!mongoose.Types.ObjectId.isValid(connectionId)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const connection = await ConnectionRequest.findOne({ _id: connectionId });
    if (!connection) {
      return res.status(404).json({ message: "Connection Request Not Found" });
    }
    console.log(user.connections);
    console.log(connection.sender);

    if (user.connections.includes(connection.sender.toString())) {
      return res
        .status(400)
        .json({ message: "user Already in your connection" });
    }

    if (user._id.toString() !== connection.receiver.toString()) {
      return res
        .status(401)
        .json({ message: "Your are not authorized to accept the request" });
    }
    connection.status = "accepted";
    await connection.save();

    await User.findOneAndUpdate(
      { _id: connection.receiver },
      { $addToSet: { connections: connection.sender } }
    );
    await User.findOneAndUpdate(
      { _id: connection.sender },
      { $addToSet: { connections: connection.receiver } }
    );

    // Notification :

    const newNotification = new Notification({
      senderId: connection.receiver,
      receiverId: connection.sender,
      notificationType: "Accepted",
    });

    try {
      await newNotification.save();
    } catch (error) {
      console.log(error);
    }

    res.json({ message: "Connection accepted successfully" });
  } catch (error) {
    console.log("Error in acceptConnection controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const rejectConnection = async (req, res) => {
  const user = req.user;
  const { id: connectionId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(connectionId)) {
      return res.status(400).json({ message: "Invalid connection Id" });
    }
    const connection = await ConnectionRequest.findOne({ _id: connectionId });
    if (!connection) {
      return res.status(404).json({ message: "Connection Request Not Found" });
    }

    if (connection.receiver.toString() !== user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Your are not authorized to Reject the request" });
    }

    if (connection.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }

    connection.status = "rejected";
    await connection.save();
    return res.status(200).json({ message: "Connection Request Rejected" });
  } catch (error) {
    console.log("Error in rejectConnection controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const pendingConnection = async (req, res) => {
  // here I need show connection which I received and the connection which I send ,were the connection status is "pending"

  const user = req.user;
  try {
    const pendingConnectionList = await ConnectionRequest.find({
      $and: [
        {
          $or: [{ sender: user._id }, { receiver: user._id }],
        },
        { status: "pending" },
      ],
    })
      .populate("sender", "userName profilePic headline")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: pendingConnectionList });
  } catch (error) {
    console.log("Error in pendingConnection controller", error);
    res.status(500).json({ message: error.message });
  }
};
