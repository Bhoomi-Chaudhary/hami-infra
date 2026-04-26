import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export async function POST(req) {
  try {
    const body = await req.json();

    const { name, email, phone, service, message } = body;

    // ✅ VALIDATION
    if (!name || !email || !message || !service) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    // Phone validation (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return Response.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // ✅ CONNECT DB
    await connectDB();

    // ✅ SAVE DATA
    const saved = await Contact.create(body);

    return Response.json({
      success: true,
      message: "Form submitted successfully",
      data: saved,
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const data = await Contact.find().sort({ createdAt: -1 });

    return Response.json(data || []);

  } catch (error) {
    console.error(error);
    return Response.json([]);
  }
}