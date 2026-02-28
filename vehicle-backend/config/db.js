// config/db.js

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: false, // Disable automatic index creation in production
      serverSelectionTimeoutMS: 5000,
    });

    if (process.env.NODE_ENV !== "production") {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);

    // Exit process if DB fails — critical in production
    process.exit(1);
  }
};

export default connectDB;