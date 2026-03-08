import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin as supabase } from "../../lib/supabase";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;

const ADMIN_USER_IDS = [
  "user_3ALlHJlXwNoezsy7eoC7qAp6yTO",
  "user_3AM3VzXy7LGvyivPbtHeNak7BDT",
];

const PRIZE_AMOUNTS: Record<number, string> = { 1: "$20", 2: "$15", 3: "$10" };
const RANK_LABELS: Record<number, string> = { 1: "1st Place 👑", 2: "2nd Place 🥈", 3: "3rd Place 🥉" };

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { seasonId } = await req.json();
  if (!seasonId) return NextResponse.json({ error: "Missing seasonId" }, { status: 400 });

  const { data: season } = await supabase
    .from("seasons")
    .select("name")
    .eq("id", seasonId)
    .single();

  const { data: winners } = await supabase
    .from("season_results")
    .select("user_id, rank, score, quizzes_completed")
    .eq("season_id", seasonId)
    .eq("reward_status", "pending")
    .lte("rank", 3)
    .order("rank", { ascending: true });

  if (!winners || winners.length === 0) {
    return NextResponse.json({ error: "No pending winners found" }, { status: 404 });
  }

  const userIds = winners.map((w: any) => w.user_id);
  const { data: users } = await supabase
    .from("users")
    .select("id, username, email")
    .in("id", userIds);

  const usersById: Record<string, any> = {};
  for (const u of users || []) usersById[u.id] = u;

  const sent: string[] = [];
  const failed: string[] = [];

  for (const winner of winners) {
    const user = usersById[winner.user_id];
    if (!user?.email) { failed.push(winner.user_id); continue; }

    const prizeAmount = PRIZE_AMOUNTS[winner.rank];
    const rankLabel = RANK_LABELS[winner.rank];
    const seasonName = season?.name || "Season 1";

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0B0E17;color:#F0F4FF;font-family:sans-serif;margin:0;padding:0;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:48px;margin-bottom:8px;">🏆</div>
      <h1 style="font-size:28px;font-weight:900;margin:0 0 8px;">You Won a Prize!</h1>
      <p style="color:#8892B0;font-size:15px;font-weight:600;margin:0;">${seasonName} — BloxQuiz.gg</p>
    </div>
    <div style="background:linear-gradient(135deg,rgba(255,227,71,0.12),rgba(184,76,255,0.08));border:2px solid rgba(255,227,71,0.35);border-radius:16px;padding:24px;text-align:center;margin-bottom:28px;">
      <div style="font-size:13px;font-weight:900;color:#FFE347;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">${rankLabel}</div>
      <div style="font-size:32px;font-weight:900;color:#00F5A0;margin-bottom:4px;">${prizeAmount} Roblox Gift Card</div>
      <div style="font-size:14px;color:#8892B0;font-weight:600;">${winner.score.toLocaleString()} pts · ${winner.quizzes_completed} quizzes completed</div>
    </div>
    <div style="background:#13172A;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-bottom:28px;">
      <p style="font-size:15px;font-weight:700;margin:0 0 16px;color:#F0F4FF;">Hey ${user.username}! 🎉</p>
      <p style="font-size:14px;color:#8892B0;font-weight:600;line-height:1.7;margin:0 0 16px;">
        Congratulations — you finished <strong style="color:#FFE347;">${rankLabel}</strong> in ${seasonName} on BloxQuiz.gg and won a <strong style="color:#00F5A0;">${prizeAmount} Roblox Gift Card</strong>!
      </p>
      <p style="font-size:14px;color:#8892B0;font-weight:600;line-height:1.7;margin:0;">
        Click the button below to claim your prize. <strong style="color:#FF3CAC;">Claims expire in 14 days</strong> — don't wait!
      </p>
    </div>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="https://www.bloxquiz.gg/rewards" style="display:inline-block;background:linear-gradient(135deg,#00F5A0,#B84CFF);color:#0B0E17;font-weight:900;font-size:16px;padding:16px 40px;border-radius:100px;text-decoration:none;">
        🎁 Claim Your Prize
      </a>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;text-align:center;">
      <p style="font-size:12px;color:#4A5568;font-weight:600;margin:0;">
        © 2026 BloxQuiz.gg — Not affiliated with Roblox Corporation<br>
        <a href="https://www.bloxquiz.gg" style="color:#B84CFF;text-decoration:none;">bloxquiz.gg</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BloxQuiz <prizes@bloxquiz.gg>",
        to: user.email,
        subject: `🏆 You won ${prizeAmount}! Claim your ${seasonName} prize — BloxQuiz`,
        html,
      }),
    });

    if (res.ok) {
      sent.push(user.email);
    } else {
      failed.push(user.email);
    }
  }

  return NextResponse.json({ success: true, sent, failed });
}