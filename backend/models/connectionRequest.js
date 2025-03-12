import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
    },
  },
  { timestamps: true }
);

export const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
