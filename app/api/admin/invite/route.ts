// app/api/admin/invite/route.ts
// POST → propose a new admin

import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import AdminInvite from "@/models/AdminInvite";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, tempPassword, proposedById } = await req.json();

    if (!name || !email || !tempPassword || !proposedById) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    await connectDB();

    // Check if email already exists as admin
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return Response.json({ error: "Admin with this email already exists" }, { status: 409 });
    }

    // Check if there's already a pending invite for this email
    const existingInvite = await AdminInvite.findOne({
      email: email.toLowerCase(),
      status: "pending",
    });
    if (existingInvite) {
      return Response.json({ error: "A pending invite for this email already exists" }, { status: 409 });
    }

    // Get total admin count (excluding MainAdmin) to calculate required approvals
    const totalAdmins = await Admin.countDocuments({ role: "admin", isActive: true });
    const requiredApprovals = Math.ceil(totalAdmins * (2 / 3)) || 1;

    // Hash the temp password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create invite — proposing admin counts as first approval
    const invite = await AdminInvite.create({
      name,
      email: email.toLowerCase(),
      tempPassword: hashedPassword,
      proposedBy: proposedById,
      approvals: [proposedById],
      requiredApprovals,
      status: "pending",
    });

    // If requiredApprovals is 1, auto-approve immediately
    if (requiredApprovals <= 1) {
      await Admin.create({
        name: invite.name,
        email: invite.email,
        password: invite.tempPassword,
        role: "admin",
        isActive: true,
      });
      await AdminInvite.findByIdAndUpdate(invite._id, { status: "approved" });
      return Response.json({ success: true, autoApproved: true });
    }

    return Response.json({ success: true, autoApproved: false, invite });
  } catch (err) {
    console.error("INVITE ERROR:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
  return Response.json({ error: "Server error" }, { status: 500 });
  }
}
