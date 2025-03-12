import express from "express";
import { protectRoute } from "../middleware/protect.route.js";
import {
  acceptConnection,
  getAllConnection,
  rejectConnection,
  sendConnection,
  pendingConnection,
} from "../controllers/connection.controller.js";

const router = express.Router();

router.get("/getall", protectRoute, getAllConnection);
router.post("/send/:receiverId", protectRoute, sendConnection);
router.post("/accept/:id", protectRoute, acceptConnection);
router.post("/reject/:id", protectRoute, rejectConnection);
router.get("/review", protectRoute, pendingConnection);

export default router;
