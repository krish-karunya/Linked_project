import express from "express";
import {
  getFeedPost,
  getPost,
  getMyPost,
  createPost,
  updatePost,
  deletePost,
  likeAndDisLikePost,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/protect.route.js";

const router = express.Router();

// CRUD operation for the post :

router.get("/", protectRoute, getFeedPost);
router.get("/mypost", protectRoute, getMyPost);
router.get("/:id", getPost);
router.post("/", protectRoute, createPost);
router.patch("/:id", protectRoute, updatePost);
router.delete("/:id", protectRoute, deletePost);
router.post("/likeanddislike/:postId", protectRoute, likeAndDisLikePost);

export default router;
