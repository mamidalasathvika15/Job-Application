// C:\Desktop\Server\routes\authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// TEST route
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working" });
});

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Issue JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Issue JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me  (protected - fetch profile)
router.get("/me", authMiddleware, (req, res) => {
  const u = req.user; // user loaded by authMiddleware

  res.json({
    message: "Profile fetched successfully",
    user: {
      id: u._id,
      name: u.name,
      email: u.email,
      currentRole: u.currentRole || "",
      targetRole: u.targetRole || "",
      location: u.location || "",
      experienceLevel: u.experienceLevel || "",
      linkedin: u.linkedin || "",
      github: u.github || "",
      portfolio: u.portfolio || "",
      jobNotes: u.jobNotes || "",
    },
  });
});

// PUT /api/auth/me  (protected - update profile)
router.put("/me", authMiddleware, async (req, res, next) => {
  try {
    const {
      name,
      email,
      currentRole,
      targetRole,
      location,
      experienceLevel,
      linkedin,
      github,
      portfolio,
      jobNotes,
    } = req.body;

    // If email is changing, check if it's already used
    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Email already in use by another account" });
      }
    }

    // Update fields only if provided (undefined means "don't touch")
    if (name !== undefined) req.user.name = name;
    if (email !== undefined) req.user.email = email;
    if (currentRole !== undefined) req.user.currentRole = currentRole;
    if (targetRole !== undefined) req.user.targetRole = targetRole;
    if (location !== undefined) req.user.location = location;
    if (experienceLevel !== undefined)
      req.user.experienceLevel = experienceLevel;
    if (linkedin !== undefined) req.user.linkedin = linkedin;
    if (github !== undefined) req.user.github = github;
    if (portfolio !== undefined) req.user.portfolio = portfolio;
    if (jobNotes !== undefined) req.user.jobNotes = jobNotes;

    const updated = await req.user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        currentRole: updated.currentRole || "",
        targetRole: updated.targetRole || "",
        location: updated.location || "",
        experienceLevel: updated.experienceLevel || "",
        linkedin: updated.linkedin || "",
        github: updated.github || "",
        portfolio: updated.portfolio || "",
        jobNotes: updated.jobNotes || "",
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
