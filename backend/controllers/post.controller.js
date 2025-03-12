import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import validator from "validator";
import { Notification } from "../models/notification.model.js";

const getPublicPost = async (req) => {
  return await Post.find({
    $and: [{ visibility: "public" }, { author: { $ne: req.user._id } }],
  }).populate("author", "userName profilePic headline");
};

export const getFeedPost = async (req, res) => {
  const user = req.user;
  const publicPost = await getPublicPost(req);
  console.log(publicPost);

  try {
    const connectionPost = await Post.find({
      $or: [
        {
          $and: [
            { visibility: "private" },
            { author: { $in: user.connections } },
          ],
        },
        { author: req.user._id },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("author", "userName profilePic headline");
    //    { author: req.user._id },
    const post = [...publicPost, ...connectionPost];

    res.status(200).json({ data: post });
  } catch (error) {
    console.log("Error in getFeedPost controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyPost = async (req, res) => {
  try {
    const post = await Post.find({ author: req.user._id });
    res.status(200).json({ data: post });
  } catch (error) {
    console.log("Error in getPost controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const postId = req.params.id;
  console.log(postId);

  try {
    // Validation for MongoDB ID :
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const post = await Post.findOne({ _id: postId });

    res.status(200).json({ data: post });
  } catch (error) {
    console.log("Error in getPost controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const user = req.user;
  try {
    const { visibility, content, image } = req.body;

    if (!visibility || !content) {
      return res
        .status(400)
        .json({ message: "Visibility and content both field is required" });
    }
    if (visibility !== "public" && visibility !== "private") {
      return res.status(400).json({ message: "Invalid visibility value" });
    }

    // if (!validator.isBase64(image)) {
    //   return res.status(400).json({ message: "Invalid Image URL format" });
    // }
    console.log(content.length);

    if (content.length < 1 || content.length > 250) {
      return res.status(400).json({
        message: "Content Length Should be within 1 and 250 characters",
      });
    }
    const newPost = new Post({
      author: user._id,
      visibility,
      content,
    });

    if (image) {
      const result = (
        await cloudinary.uploader.upload(image, { folder: "post" })
      ).secure_url;
      newPost.image = result;
    } else {
      newPost.image = "";
    }

    await newPost.save();

    res.status(201).json({ data: newPost });
  } catch (error) {
    console.log("Error in createPost controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { content, visibility } = req.body;

  try {
    // Validation for MongoDB ID :
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    if (visibility) {
      if (visibility !== "public" && visibility !== "private") {
        return res.status(400).json({ message: "Invalid visibility value" });
      }
    }
    if (content.length < 1 || content.length > 250) {
      return res.status(400).json({
        message: "Content Length Should be within 1 and 250 characters",
      });
    }

    const post = await Post.findByIdAndUpdate({ _id: postId }, req.body, {
      new: true,
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Send updated post response
    res.status(200).json({ data: post });
  } catch (error) {
    console.log("Error in updatePost controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    // Validation for MongoDB ID :
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Id" });
    }
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: "Post Not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Your are not authorized to delete" });
    }
    const publicId = post.image.split("/").pop().split(".")[0];
    try {
      await cloudinary.uploader.destroy(`post/${publicId}`);
      console.log("Image has been deleted from cloudinary");
    } catch (error) {
      console.log("Error in deleting image from cloudinary ");
    }
    await Post.findByIdAndDelete({ _id: postId });

    res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (error) {
    console.log("Error in deletePost controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const likeAndDisLikePost = async (req, res) => {
  const currentUser = req.user;
  const postId = req.params.postId;
  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post Id" });
    }

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post Not found" });
    }
    if (post.like.includes(currentUser._id.toString())) {
      post.like = post.like.filter(
        (userId) => userId.toString() !== currentUser._id.toString()
      );

      await post.save();
      return res
        .status(200)
        .json({ message: "You Disliked the post", data: post });
    } else {
      post.like.push(currentUser._id);
      // Notification Todo :

      if (currentUser._id.toString() !== post.author.toString()) {
        const newNotification = new Notification({
          postId,
          notificationType: "like",
          senderId: currentUser._id,
          receiverId: post.author,
        });

        await newNotification.save();
      }
    }
    await post.save();
    res.status(200).json({ message: "Liked Successfully", data: post });
  } catch (error) {
    console.log("Error in likePost controller", error);
    res.status(500).json({ message: error.message });
  }
};
