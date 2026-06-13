// app/api/admin/[id]/password/route.ts
// POST → change own password

import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { currentPassword, newPassword } = await req.json();
    const { id } = params;

    if (!currentPassword || !newPassword) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectDB();

    const admin = await Admin.findById(id);
    if (!admin) {
      return Response.json({ error: "Admin not found" }, { status: 404 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return Response.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    // Hash and save new password
    const hashed = await bcrypt.hash(newPassword, 10);
    await Admin.findByIdAndUpdate(id, { password: hashed });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
