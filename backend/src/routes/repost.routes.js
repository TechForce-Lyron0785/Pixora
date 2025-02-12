import { Router } from "express";
import {
  createRepost,
  getRepost,
  getUserReposts,
  getImageReposts,
  updateRepost,
  deleteRepost
} from "../controllers/repost.controllers.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/:repostId", getRepost);
router.get("/user/:userId", getUserReposts);
router.get("/image/:imageId", getImageReposts);

// Protected routes
router.post("/", authenticateUser, createRepost);
router.patch("/:repostId", authenticateUser, updateRepost);
router.delete("/:repostId", authenticateUser, deleteRepost);

export default router;
