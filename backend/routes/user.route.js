import express from "express";
import {
  getMyProfile,
  getMySuggestions,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protect.route.js";

const router = express.Router();

router.get("/", protectRoute, getMyProfile);
router.get("/suggestions", protectRoute, getMySuggestions);
router.patch("/profile/edit", protectRoute, updateProfile);

export default router;
