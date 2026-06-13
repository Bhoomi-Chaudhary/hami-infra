// app/api/site-content/route.ts
// GET  → fetch all content or filter by page
// POST → create or update a content entry

import { connectDB } from "@/lib/db";
import SiteContent from "@/models/SiteContent";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const key = searchParams.get("key");

    await connectDB();

    const query: Record<string, string> = {};
    if (page) query.page = page;
    if (key) query.key = key;

    const content = await SiteContent.find(query)
      .populate("updatedBy", "name email")
      .sort({ page: 1, section: 1 });

    return Response.json(content);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { key, value, type, page, section, updatedBy } = await req.json();

    if (!key || !value || !type || !page || !section) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["text", "image"].includes(type)) {
      return Response.json({ error: "Type must be text or image" }, { status: 400 });
    }

    await connectDB();

    // Upsert — create if not exists, update if exists
    const content = await SiteContent.findOneAndUpdate(
      { key },
      { key, value, type, page, section, updatedBy },
      { upsert: true, new: true }
    );

    return Response.json({ success: true, content });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
