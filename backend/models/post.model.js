import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    comment: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
    commentCount: {
      type: Number,
    },
    like: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    likeCount: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
