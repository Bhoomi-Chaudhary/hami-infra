// app/api/admin/change-password/route.js
// Requires: ADMIN_PASSWORD env var (read) + ability to write back
// Since env vars can't be written at runtime, this updates a simple
// file-based override OR you can adapt it to your preferred secret store.
// The simplest production approach: store the hashed password in MongoDB.

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import AdminConfig from "@/models/AdminConfig";

export async function POST(req) {
  try {
    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return Response.json({ error: "Password too short" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await connectDB();
    await AdminConfig.findOneAndUpdate(
      { key: "admin_password" },
      { key: "admin_password", value: hashed },
      { upsert: true, new: true }
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
