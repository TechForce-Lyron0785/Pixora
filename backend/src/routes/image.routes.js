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
  uploadImageFile,
  uploadTempImage,
  deleteCloudinaryImage,
  saveImageDetails,
  getPopularTags
} from "../controllers/image.controllers.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";

const router = Router();

// All routes now require authentication
router.get("/public", authenticateUser, getAllImages);
router.get("/search", authenticateUser, searchImages);
router.get("/discover/trending", authenticateUser, getTrendingImages);
router.get("/tags/popular", authenticateUser, getPopularTags);
router.get("/tags/:tag", authenticateUser, getImagesByTag);
router.get("/user/:userId", authenticateUser, getUserPublicImages);
router.get("/:imageId", authenticateUser, getImage);
router.get("/me", authenticateUser, getUserImages);

router.post("/upload", authenticateUser, upload.single("image"), uploadImageFile);
router.post("/upload-temp", authenticateUser, upload.single("image"), uploadTempImage);
router.post("/save-details", authenticateUser, saveImageDetails);
router.delete("/cloudinary/:publicId", authenticateUser, deleteCloudinaryImage);
router.patch("/:imageId", authenticateUser, updateImage);
router.delete("/:imageId", authenticateUser, deleteImage);

export default router;
