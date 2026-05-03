import mongoose from "mongoose";

interface IAdminConfig {
  key: string;
  value: string;
}

const AdminConfigSchema = new mongoose.Schema<IAdminConfig>({
  key:   { type: String, required: true, unique: true },
  value: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.AdminConfig ||
  mongoose.model<IAdminConfig>("AdminConfig", AdminConfigSchema);