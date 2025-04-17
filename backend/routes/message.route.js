import express from "express";
import { protectRoute } from "../middleware/protect.route.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessage);
router.post("/:id", protectRoute, sendMessage);

export default router;
