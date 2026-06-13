import mongoose from "mongoose";

export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "main" | "admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["main", "admin"], default: "admin" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Admin ||
  mongoose.model<IAdmin>("Admin", AdminSchema);
