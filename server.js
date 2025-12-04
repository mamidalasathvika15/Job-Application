// C:\Desktop\Server\server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// ===== MIDDLEWARE =====

// Secure HTTP headers
app.use(helmet());

// Allow requests from frontend (for local dev we allow all origins)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Rate limiting for auth routes (avoid brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // max 50 requests per 15 minutes per IP
  message: { message: "Too many auth requests, please try again later." },
});

// ===== ROUTES =====

// Apply limiter only to /api/auth
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/applications", applicationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Job Application Tracker API is running",
  });
});

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
