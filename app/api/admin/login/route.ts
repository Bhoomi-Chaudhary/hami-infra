// app/api/admin/login/route.ts
// POST → verify password, return admin object
// Checks MongoDB Admin collection first, falls back to env var for MainAdmin

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import AdminConfig from "@/models/AdminConfig";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (!password) {
      return Response.json({ error: "Missing password" }, { status: 400 });
    }

    await connectDB();

    // 1. Check if a matching admin exists in the Admin collection
    const allAdmins = await Admin.find({ isActive: true });
    for (const admin of allAdmins) {
      const match = await bcrypt.compare(password, admin.password);
      if (match) {
        return Response.json({
          success: true,
          admin: {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            isActive: admin.isActive,
            createdAt: admin.createdAt,
          },
        });
      }
    }

    // 2. Fall back to AdminConfig (legacy password change system)
    const record = await AdminConfig.findOne({ key: "admin_password" });
    if (record?.value) {
      const match = await bcrypt.compare(password, record.value);
      if (match) {
        return Response.json({
          success: true,
          admin: {
            _id: "main",
            name: "Admin",
            email: process.env.ADMIN_MAIN_EMAIL ?? "",
            role: "main",
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        });
      }
    }

    // 3. Fall back to plain ADMIN_PASSWORD env var (initial setup, before any DB records)
    if (password === process.env.ADMIN_PASSWORD) {
      return Response.json({
        success: true,
        admin: {
          _id: "main",
          name: "Admin",
          email: process.env.ADMIN_MAIN_EMAIL ?? "",
          role: "main",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      });
    }

    return Response.json({ error: "Invalid password" }, { status: 401 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
































// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const { password } = await req.json();

//   if (password === process.env.ADMIN_PASSWORD) {
//     return new NextResponse(null, { status: 200 });
//   }

//   return new NextResponse(null, { status: 401 });
// }