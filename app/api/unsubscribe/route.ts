import { NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID!;

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    // Mark contact as unsubscribed in Resend
    const res = await fetch(
      `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: true }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err.message || "Failed to unsubscribe" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}