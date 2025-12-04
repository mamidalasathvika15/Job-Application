// C:\Desktop\Server\models\User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // extra profile fields (optional)
    currentRole: { type: String },
    targetRole: { type: String },
    location: { type: String },
    experienceLevel: { type: String }, // e.g. Student, Fresher, 0-1 years, 2-4 years...

    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },

    jobNotes: { type: String }, // free text, "Job search notes"
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
