import mongoose from "mongoose";
// console.log("ENV:", process.env.MONGO_URI);

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB error:", error);
  }
}
