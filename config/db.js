// C:\Desktop\Server\config\db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // We are NOT stopping the server here, just logging the error for now
  }
};

module.exports = connectDB;
