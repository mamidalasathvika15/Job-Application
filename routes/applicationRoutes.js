// C:\Desktop\Server\routes\applicationRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const JobApplication = require("../models/JobApplication");

// GET /api/applications  (all apps for logged-in user)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const apps = await JobApplication.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(apps);
  } catch (error) {
    console.error("Get applications error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/applications  (create new application)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { company, position, status, appliedDate, notes } = req.body;

    if (!company || !position) {
      return res
        .status(400)
        .json({ message: "Company and position are required" });
    }

    const app = await JobApplication.create({
      user: req.user._id,
      company,
      position,
      status: status || "Applied",
      appliedDate: appliedDate || Date.now(),
      notes: notes || "",
    });

    res.status(201).json(app);
  } catch (error) {
    console.error("Create application error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/applications/:id  (update one application)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { company, position, status, notes } = req.body;

    const app = await JobApplication.findOne({ _id: id, user: req.user._id });
    if (!app) {
      return res
        .status(404)
        .json({ message: "Application not found for this user" });
    }

    if (company !== undefined) app.company = company;
    if (position !== undefined) app.position = position;
    if (status !== undefined) app.status = status;
    if (notes !== undefined) app.notes = notes;

    const updated = await app.save();
    res.json(updated);
  } catch (error) {
    console.error("Update application error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/applications/:id  (delete one application)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const app = await JobApplication.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!app) {
      return res
        .status(404)
        .json({ message: "Application not found for this user" });
    }

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete application error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
