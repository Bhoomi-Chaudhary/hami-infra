// app/api/contact/[id]/route.js

import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await connectDB();
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
