// app/api/admin/invites/route.ts
// GET → list all pending invites with proposer details

import { connectDB } from "@/lib/db";
import AdminInvite from "@/models/AdminInvite";

export async function GET() {
  try {
    await connectDB();

    const invites = await AdminInvite.find({ status: "pending" })
      .populate("proposedBy", "name email")
      .populate("approvals", "name email")
      .sort({ createdAt: -1 });

    return Response.json(invites);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
