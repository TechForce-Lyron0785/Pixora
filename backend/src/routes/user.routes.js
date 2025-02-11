import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  getLoggedInUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getAllUsers,
  searchUsers
} from "../controllers/user.controllers.js";

const router = express.Router();

// Authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// User profile routes (Protected)
router.get("/me", authenticateUser, getLoggedInUser);
router.patch("/:userId", authenticateUser, updateUserProfile);
router.patch("/:userId/password", authenticateUser, updateUserPassword);

// Public routes
router.get("/", getAllUsers);
router.get("/:identifier", getUserProfile);
router.get("/search", searchUsers);

export default router;
