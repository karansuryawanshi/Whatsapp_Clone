import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;
export async function connectDB() {
  if (!uri) throw new Error("MONGODB_URI not set");
  await mongoose.connect(uri, {
    // default mongoose options are fine for modern versions
  });
  console.log("MongoDB connected");
}
