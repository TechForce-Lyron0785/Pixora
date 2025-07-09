import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import followRoutes from "./routes/follow.routes.js";
import imageRoutes from "./routes/image.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import collectionRoutes from "./routes/collection.routes.js";

const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Allow all
  credentials: true, // Allow cookies & authentication headers
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Default route to test if the server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/collections", collectionRoutes);

export { app };