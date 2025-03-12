import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    content: {
      type: String,
    },
    notificationType: {
      type: String,
      enum: ["like", "comment", "connection"],
    },
    read: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
