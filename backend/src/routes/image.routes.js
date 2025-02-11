import { Router } from "express";
import {
  uploadImage,
  getImage,
  getAllImages,
  getUserImages,
  getUserPublicImages,
  updateImage,
  deleteImage,
  searchImages,
  getTrendingImages,
  getImagesByTag
} from "../controllers/image.controllers.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/public", getAllImages);
router.get("/search", searchImages);
router.get("/discover/trending", getTrendingImages);
router.get("/tags/:tag", getImagesByTag);
router.get("/user/:userId", getUserPublicImages);
router.get("/:imageId", getImage);

// Protected routes
router.post("/", authenticateUser, uploadImage);
router.get("/me", authenticateUser, getUserImages);
router.patch("/:imageId", authenticateUser, updateImage);
router.delete("/:imageId", authenticateUser, deleteImage);

export default router;
