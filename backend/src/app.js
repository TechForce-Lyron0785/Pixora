import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

// Import routes
import userRoutes from "./routes/user.routes.js"
import followRoutes from "./routes/follow.routes.js"
import imageRoutes from "./routes/image.routes.js"
import favoritesRoutes from "./routes/favorites.routes.js"
import likesRoutes from "./routes/likes.routes.js"
import commentRoutes from "./routes/comment.routes.js"
import repostRoutes from "./routes/repost.routes.js"
import reportRoutes from "./routes/report.routes.js"
import tagRoutes from "./routes/tag.routes.js"
import savedSearchRoutes from "./routes/savedSearch.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import albumRoutes from "./routes/album.routes.js"

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({limit: "16kb", extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

// Define routes
app.use("/api/users", userRoutes)
app.use("/api/follow", followRoutes)
app.use("/api/images", imageRoutes)
app.use("/api/favorites", favoritesRoutes)
app.use("/api/likes", likesRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/reposts", repostRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/tags", tagRoutes)
app.use("/api/saved-searches", savedSearchRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/albums", albumRoutes)

export {app}