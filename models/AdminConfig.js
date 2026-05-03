// models/AdminConfig.js
import mongoose from "mongoose";

const AdminConfigSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.AdminConfig ||
  mongoose.model("AdminConfig", AdminConfigSchema);
