import express from "express";
import { protectRoute } from "../middleware/protect.route.js";
import {
  createComment,
  deleteComment,
  getAllComment,
  updateComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

// CRUD operation for the comment :

router.get("/:postId", protectRoute, getAllComment);
router.post("/:postId", protectRoute, createComment);
router.patch("/:postId/:id", protectRoute, updateComment);
router.delete("/:postId/:id", protectRoute, deleteComment);

export default router;
