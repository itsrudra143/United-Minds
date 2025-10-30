const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./modules/auth/auth.middleware")();
app.use(passport.initialize());

// Import routes
const authRoutes = require("./modules/auth/auth.routes.js");
const threadRoutes = require("./modules/thread/thread.routes.js");
const replyRoutes = require("./modules/reply/reply.routes.js");
const categoryRoutes = require("./modules/category/category.routes.js");
const tagRoutes = require("./modules/tag/tag.routes.js");
const voteRoutes = require("./modules/vote/vote.routes.js");
const repostRoutes = require("./modules/repost/repost.routes.js");
const followRoutes = require("./modules/follow/follow.routes.js");

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "United Minds API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/reposts", repostRoutes);
app.use("/api/follows", followRoutes);

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app;
