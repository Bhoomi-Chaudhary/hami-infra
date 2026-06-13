import mongoose from "mongoose";

export interface IAdminInvite {
  _id: string;
  name: string;
  email: string;
  tempPassword: string;
  proposedBy: mongoose.Types.ObjectId;
  approvals: mongoose.Types.ObjectId[];
  requiredApprovals: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

const AdminInviteSchema = new mongoose.Schema<IAdminInvite>(
  {
    name:              { type: String, required: true },
    email:             { type: String, required: true, lowercase: true },
    tempPassword:      { type: String, required: true },
    proposedBy:        { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    approvals:         [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
    requiredApprovals: { type: Number, required: true },
    status:            { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.AdminInvite ||
  mongoose.model<IAdminInvite>("AdminInvite", AdminInviteSchema);
