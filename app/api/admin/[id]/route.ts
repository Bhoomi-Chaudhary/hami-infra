// app/api/admin/[id]/route.ts
// DELETE → remove an admin (MainAdmin only)
// GET    → get single admin details

import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { requestedById } = await req.json();
    const { id } = params;

    if (!requestedById) {
      return Response.json({ error: "requestedById required" }, { status: 400 });
    }

    await connectDB();

    // Only MainAdmin can delete
    const requester = await Admin.findById(requestedById);
    if (!requester || requester.role !== "main") {
      return Response.json({ error: "Only MainAdmin can delete admins" }, { status: 403 });
    }

    // Cannot delete yourself
    if (requestedById === id) {
      return Response.json({ error: "You cannot delete yourself" }, { status: 400 });
    }

    const target = await Admin.findById(id);
    if (!target) {
      return Response.json({ error: "Admin not found" }, { status: 404 });
    }

    // Cannot delete another MainAdmin
    if (target.role === "main") {
      return Response.json({ error: "Cannot delete MainAdmin" }, { status: 403 });
    }

    await Admin.findByIdAndDelete(id);

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const admin = await Admin.findById(params.id).select("-password");
    if (!admin) {
      return Response.json({ error: "Admin not found" }, { status: 404 });
    }

    return Response.json(admin);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
