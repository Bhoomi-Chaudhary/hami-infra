import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ✅ Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, service, message } = body;

    // ✅ VALIDATION
    if (!name || !email || !phone || !message || !service) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!/^\+?\d{10,15}$/.test(phone)) {
      return Response.json({ error: "Invalid phone number" }, { status: 400 });
    }

    // ✅ CONNECT DB & SAVE
    await connectDB();
    const saved = await Contact.create({ name, email, phone, service, message });

    // ✅ SEND EMAIL
    await transporter.sendMail({
      from: `"Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: `New Enquiry - ${service}`,
      html: `
        <h2>New Enquiry Received</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Service</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${service}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
          </tr>
        </table>
        <p style="color: #aaa; font-size: 12px;">Submitted at: ${new Date().toLocaleString()}</p>
      `,
    });

    return Response.json({
      success: true,
      message: "Form submitted successfully",
      data: saved,
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const data = await Contact.find().sort({ createdAt: -1 });
    return Response.json(data || []);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}