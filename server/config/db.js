import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();



const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    const conn = await mongoose.connect(connStr);
    console.log(`✅ MongoDB connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
