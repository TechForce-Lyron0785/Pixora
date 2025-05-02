import { Router } from "express";
import {
  createCollection,
  getUserCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addImageToCollection,
  removeImageFromCollection,
  addCollaborator,
  removeCollaborator,
  getCollectionsByImage,
  getPublicCollections
} from "../controllers/collection.controllers.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.post("/", authenticateUser, createCollection);
router.get("/", authenticateUser, getUserCollections);
router.get("/public", authenticateUser, getPublicCollections);
router.get("/image/:imageId", authenticateUser, getCollectionsByImage);
router.get("/:collectionId", authenticateUser, getCollectionById);
router.put("/:collectionId", authenticateUser, updateCollection);
router.delete("/:collectionId", authenticateUser, deleteCollection);

// Image management in collections
router.post("/:collectionId/images/:imageId", authenticateUser, addImageToCollection);
router.delete("/:collectionId/images/:imageId", authenticateUser, removeImageFromCollection);

// Collaborator management
router.post("/:collectionId/collaborators", authenticateUser, addCollaborator);
router.delete("/:collectionId/collaborators/:userId", authenticateUser, removeCollaborator);

export default router; 