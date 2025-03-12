import mongoose from "mongoose";
import { Notification } from "../models/notification.model.js";

export const getAllNotification = async (req, res) => {
  const user = req.user;
  try {
    const notificationList = await Notification.find({
      receiverId: user._id,
    })
      .populate("postId", "image content")
      .populate("senderId", "userName profilePic")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: notificationList });
  } catch (error) {
    console.log("Error in getAllNotification controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  const user = req.user;
  const { id: notificationId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const notification = await Notification.findOne({
      _id: notificationId,
      receiverId: user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification Not Found" });
    }

    await Notification.findByIdAndDelete({ _id: notificationId });

    res
      .status(200)
      .json({ message: "Notification has been deleted Successfully" });
  } catch (error) {
    console.log("Error in deleteNotification controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const markAsReadNotification = async (req, res) => {
  const { id: notificationId } = req.params;
  const user = req.user;

  try {
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ message: "Invalid Id" });
    }
    const notification = await Notification.findOne({
      _id: notificationId,
      receiverId: user._id,
      read: false,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification Not Found" });
    }

    notification.read = true;

    await notification.save();

    res.status(200).json({ message: "Marked as Read", data: notification });
  } catch (error) {
    console.log("Error in markAsReadNotification controller", error);
    res.status(500).json({ message: error.message });
  }
};
