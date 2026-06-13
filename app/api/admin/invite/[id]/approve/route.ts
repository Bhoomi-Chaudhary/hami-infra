// app/api/admin/invite/[id]/approve/route.ts
// POST → cast approval on a pending invite

import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import AdminInvite from "@/models/AdminInvite";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { adminId } = await req.json();
    const { id } = params;

    if (!adminId) {
      return Response.json({ error: "adminId required" }, { status: 400 });
    }

    await connectDB();

    const invite = await AdminInvite.findById(id);

    if (!invite) {
      return Response.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.status !== "pending") {
      return Response.json({ error: "Invite is no longer pending" }, { status: 400 });
    }

    // Check if this admin already approved
    const alreadyApproved = invite.approvals.some(
      (a: any) => a.toString() === adminId
    );
    if (alreadyApproved) {
      return Response.json({ error: "You have already approved this invite" }, { status: 400 });
    }

    // Add approval
    invite.approvals.push(adminId);

    // Check if threshold met
    const isMainAdmin = (await Admin.findById(adminId))?.role === "main";
    const thresholdMet =
      isMainAdmin || invite.approvals.length >= invite.requiredApprovals;

    if (thresholdMet) {
      // Create the new admin
      await Admin.create({
        name: invite.name,
        email: invite.email,
        password: invite.tempPassword,
        role: "admin",
        isActive: true,
      });
      invite.status = "approved";
    }

    await invite.save();

    return Response.json({
      success: true,
      approved: thresholdMet,
      approvalsCount: invite.approvals.length,
      requiredApprovals: invite.requiredApprovals,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
