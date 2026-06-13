import mongoose from "mongoose";

export interface ISiteContent {
  _id: string;
  key: string;
  value: string;
  type: "text" | "image";
  page: string;
  section: string;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

const SiteContentSchema = new mongoose.Schema<ISiteContent>(
  {
    key:       { type: String, required: true, unique: true },
    value:     { type: String, required: true },
    type:      { type: String, enum: ["text", "image"], required: true },
    page:      { type: String, required: true },
    section:   { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.models.SiteContent ||
  mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);
