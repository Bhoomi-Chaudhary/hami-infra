// app/api/admin/login/route.js
// Checks MongoDB-stored password first; falls back to ADMIN_PASSWORD env var.

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import AdminConfig from "@/models/AdminConfig";

export async function POST(req:Request) {
  try {
    const { password } = await req.json();
    if (!password) return Response.json({ error: "Missing password" }, { status: 400 });

    await connectDB();
    const record = await AdminConfig.findOne({ key: "admin_password" });

    if (record?.value) {
      // bcrypt hash stored in DB
      const match = await bcrypt.compare(password, record.value);
      if (match) return Response.json({ success: true });
    } else {
      // Fall back to plain env var (initial setup)
      if (password === process.env.ADMIN_PASSWORD) {
        return Response.json({ success: true });
      }
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