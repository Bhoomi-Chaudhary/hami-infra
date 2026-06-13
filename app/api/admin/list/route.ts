// app/api/admin/list/route.ts
// GET → list all admins (excluding password)

import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function GET() {
  try {
    await connectDB();
    const admins = await Admin.find().select("-password").sort({ createdAt: 1 });
    return Response.json(admins);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
