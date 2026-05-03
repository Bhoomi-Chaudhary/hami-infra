import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password === process.env.ADMIN_PASSWORD) {
    return new NextResponse(null, { status: 200 });
  }

  return new NextResponse(null, { status: 401 });
}