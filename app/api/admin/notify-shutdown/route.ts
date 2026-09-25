// app/api/admin/notify-shutdown/route.ts
// One-time admin route: emails ALL users with an email address (registered users +
// code alert subscribers) the shutdown announcement via Resend.
// Call it once from the browser while logged in as admin: /api/admin/notify-shutdown
// Delete this route after the send.
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "../../../lib/supabase";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const SHUTDOWN_DATE = "October 10, 2026";

const ADMIN_USER_IDS = [
  "user_3ALlHJlXwNoezsy7eoC7qAp6yTO",
  "user_3AM3VzXy7LGvyivPbtHeNak7BDT",
  "user_3APPYs0LjMfWCIt6lBfIiYyVteU",
  "user_3AjIcCtvCn5wdcF1RPZEhGV1RFj",
];

export async function GET() {
  const { userId } = await auth();
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Collect emails: registered users + code alert subscribers (dedup)
  const emails = new Set<string>();

  const { data: users } = await supabaseAdmin.from("users").select("email").not("email", "is", null);
  for (const u of users || []) if (u.email) emails.add(u.email.toLowerCase());

  // Code alert subscribers — table name from EmailSignup; adjust if yours differs
  const { data: subs } = await supabaseAdmin.from("email_subscribers").select("email").not("email", "is", null);
  for (const s of subs || []) if (s.email) emails.add(s.email.toLowerCase());

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0B0E17;color:#F0F4FF;font-family:sans-serif;margin:0;padding:0;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:48px;margin-bottom:8px;">👋</div>
      <h1 style="font-size:26px;font-weight:900;margin:0;">BloxQuiz is Shutting Down</h1>
    </div>
    <div style="background:#13172A;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="font-size:14px;color:#8892B0;font-weight:600;line-height:1.7;margin:0 0 16px;">
        After a great run, BloxQuiz is closing its doors. The site will go offline on <strong style="color:#FFE347;">${SHUTDOWN_DATE}</strong>.
      </p>
      <p style="font-size:13px;font-weight:900;color:#FF3CAC;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;">What this means</p>
      <ul style="margin:0 0 16px;padding-left:18px;color:#8892B0;font-size:13px;font-weight:600;line-height:1.9;">
        <li>The Q3 2026 season is cancelled. No prizes will be awarded this season.</li>
        <li>All accounts, scores, and leaderboard data will be permanently deleted when the site goes offline.</li>
        <li>Quizzes and all content will no longer be accessible after ${SHUTDOWN_DATE}.</li>
      </ul>
      <p style="font-size:14px;color:#8892B0;font-weight:600;line-height:1.7;margin:0;">
        Thank you to everyone who played, competed, and made this community what it was.
      </p>
    </div>
    <p style="font-size:12px;color:#4A5568;font-weight:600;text-align:center;margin:0;">— The BloxQuiz Team<br>© 2026 BloxQuiz.gg</p>
  </div>
</body>
</html>`;

  const sent: string[] = [];
  const failed: string[] = [];

  for (const email of emails) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BloxQuiz <prizes@bloxquiz.gg>",
        to: email,
        subject: "BloxQuiz is shutting down",
        html,
      }),
    });
    if (res.ok) sent.push(email);
    else failed.push(email);
    // Resend free tier rate limit: ~2 req/sec — small delay between sends
    await new Promise(r => setTimeout(r, 600));
  }

  return NextResponse.json({ total: emails.size, sent: sent.length, failed });
}