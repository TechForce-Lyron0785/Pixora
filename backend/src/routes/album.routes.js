import { Router } from "express";
import {
  createAlbum,
  getUserAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum
} from "../controllers/album.controllers.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Protected routes
router.post("/", authenticateUser, createAlbum);
router.get("/", authenticateUser, getUserAlbums);
router.get("/:albumId", authenticateUser, getAlbumById);
router.patch("/:albumId", authenticateUser, updateAlbum);
router.delete("/:albumId", authenticateUser, deleteAlbum);

export default router;
