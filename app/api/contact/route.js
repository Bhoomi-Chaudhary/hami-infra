import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  await Contact.create(body);

  return Response.json({ success: true });
}

export async function GET() {
  await connectDB();

  const data = await Contact.find().sort({ createdAt: -1 });

  return Response.json(data);
}