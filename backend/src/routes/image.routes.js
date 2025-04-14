import { Router } from "express";
import {
  getImage,
  getAllImages,
  getUserImages,
  getUserPublicImages,
  updateImage,
  deleteImage,
  searchImages,
  getTrendingImages,
  getImagesByTag,
  uploadImageFile
} from "../controllers/image.controllers.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";

const router = Router();

// Public routes
router.get("/public", getAllImages);
router.get("/search", searchImages);
router.get("/discover/trending", getTrendingImages);
router.get("/tags/:tag", getImagesByTag);
router.get("/user/:userId", getUserPublicImages);
router.get("/:imageId", getImage);

// Protected routes
router.post("/upload", authenticateUser, upload.single("image"), uploadImageFile);
router.get("/me", authenticateUser, getUserImages);
router.patch("/:imageId", authenticateUser, updateImage);
router.delete("/:imageId", authenticateUser, deleteImage);

export default router;
