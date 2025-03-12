import express from "express";
import {
  deleteNotification,
  getAllNotification,
  markAsReadNotification,
} from "../controllers/notification.controller.js";
import { protectRoute } from "../middleware/protect.route.js";

const router = express.Router();

router.get("/get", protectRoute, getAllNotification);
router.delete("/delete/:id", protectRoute, deleteNotification);
router.post("/read/:id", protectRoute, markAsReadNotification);

export default router;
