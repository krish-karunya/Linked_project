import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { Notification } from "../models/notification.model.js";

export const createComment = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;
  const { content } = req.body;
  console.log(postId);

  try {
    // Validation for MongoDB ID :
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const post = await Post.findOne({ _id: postId });
    console.log(post);

    if (!post) {
      return res.status(404).json({ message: "post Id Not Found" });
    }

    if (content.length > 500) {
      return res
        .status(400)
        .json({ message: "Content length should less than 500 character" });
    }

    const newComment = new Comment({
      postId,
      userId,
      content,
    });

    post.comment.push(newComment._id);
    console.log(userId.toString());
    console.log(post.author.toString());

    // Notification Todo :
    if (userId.toString() !== post.author.toString()) {
      const newNotification = new Notification({
        postId,
        content,
        notificationType: "comment",
        senderId: userId,
        receiverId: post.author,
      });

      await newNotification.save();
    }
    await Promise.all([post.save(), newComment.save()]);

    res
      .status(201)
      .json({ message: "comment created Successfully", data: newComment });
  } catch (error) {
    console.log("Error in createComment controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllComment = async (req, res) => {
  const { postId } = req.params;
  try {
    // Validation for MongoDB ID :
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Id" });
    }
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.find({ postId })
      .populate("userId", "userName profilePic headline")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: comment });
  } catch (error) {
    console.log("Error in getAllComment controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateComment = async (req, res) => {
  const { postId, id: commentId } = req.params;
  const { content } = req.body;
  try {
    // Validation for MongoDB ID :
    if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return res.status(400).json({ message: "Invalid Id" });
    }
    if (content.length > 500) {
      return res
        .status(400)
        .json({ message: "Content length should less than 500 character" });
    }

    const post = await Post.findOne({ _id: postId });
    console.log(post);

    if (!post) {
      return res.status(404).json({ message: "post Id Not Found" });
    }

    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      return res.status(404).json({ message: "comment Id Not Found" });
    }
    console.log(comment.userId);
    console.log(req.user._id);

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to edit" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      { _id: commentId },
      { content },
      { new: true }
    ).populate("userId", "userName profilePic headline");

    res.status(200).json({ data: updatedComment });
  } catch (error) {
    console.log("Error in updateComment controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { postId, id: commentId } = req.params;
  try {
    // Validation for MongoDB ID :
    if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const post = await Post.findOne({ _id: postId });
    console.log(post);

    if (!post) {
      return res.status(404).json({ message: "post Id Not Found" });
    }

    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      return res.status(404).json({ message: "comment Id Not Found" });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to edit" });
    }

    await Post.findByIdAndUpdate(
      { _id: post._id },
      { $pull: { comment: commentId } }
    );
    await Comment.findByIdAndDelete({
      _id: commentId,
    });

    res.status(200).json({ message: "Comment deleted Successfully" });
  } catch (error) {
    console.log("Error in deleteComment controller", error);
    res.status(500).json({ message: error.message });
  }
};
