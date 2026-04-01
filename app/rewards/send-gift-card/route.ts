import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "../../../lib/supabase";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;

const ADMIN_USER_IDS = [
  "user_3ALlHJlXwNoezsy7eoC7qAp6yTO",
  "user_3AM3VzXy7LGvyivPbtHeNak7BDT",
  "user_3APPYs0LjMfWCIt6lBfIiYyVteU",
  "user_3AjIcCtvCn5wdcF1RPZEhGV1RFj",
];

const PRIZE_AMOUNTS: Record<number, string> = { 1: "$20", 2: "$15", 3: "$10" };
const RANK_LABELS: Record<number, string> = { 1: "1st Place 👑", 2: "2nd Place 🥈", 3: "3rd Place 🥉" };

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { claimId, giftCardCode } = await req.json();
  if (!claimId || !giftCardCode?.trim()) {
    return NextResponse.json({ error: "Missing claimId or giftCardCode" }, { status: 400 });
  }

  // Fetch claim details
  const { data: claim, error: claimError } = await supabaseAdmin
    .from("prize_claims")
    .select("id, user_id, season_id, roblox_username, email, discord, status")
    .eq("id", claimId)
    .single();

  if (claimError || !claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  // Fetch season name
  const { data: season } = await supabaseAdmin
    .from("seasons")
    .select("name")
    .eq("id", claim.season_id)
    .single();

  // Fetch rank and username
  const { data: result } = await supabaseAdmin
    .from("season_results")
    .select("rank")
    .eq("season_id", claim.season_id)
    .eq("user_id", claim.user_id)
    .single();

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("username")
    .eq("id", claim.user_id)
    .single();

  const rank = result?.rank || 1;
  const username = user?.username || "Champion";
  const prizeAmount = PRIZE_AMOUNTS[rank] || "Gift Card";
  const rankLabel = RANK_LABELS[rank] || "Winner";
  const seasonName = season?.name || "Season 1";

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0B0E17;color:#F0F4FF;font-family:sans-serif;margin:0;padding:0;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:48px;margin-bottom:8px;">🎁</div>
      <h1 style="font-size:28px;font-weight:900;margin:0 0 8px;">Your Gift Card is Here!</h1>
      <p style="color:#8892B0;font-size:15px;font-weight:600;margin:0;">${seasonName} — BloxQuiz.gg</p>
    </div>

    <div style="background:linear-gradient(135deg,rgba(255,227,71,0.12),rgba(184,76,255,0.08));border:2px solid rgba(255,227,71,0.35);border-radius:16px;padding:24px;text-align:center;margin-bottom:28px;">
      <div style="font-size:13px;font-weight:900;color:#FFE347;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">${rankLabel}</div>
      <div style="font-size:32px;font-weight:900;color:#00F5A0;margin-bottom:4px;">${prizeAmount} Roblox Gift Card</div>
      <div style="font-size:14px;color:#8892B0;font-weight:600;">Redeemable on Amazon</div>
    </div>

    <div style="background:#13172A;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-bottom:28px;">
      <p style="font-size:15px;font-weight:700;margin:0 0 12px;color:#F0F4FF;">Hey ${username}! 🎉</p>
      <p style="font-size:14px;color:#8892B0;font-weight:600;line-height:1.7;margin:0 0 20px;">
        Congratulations on finishing <strong style="color:#FFE347;">${rankLabel}</strong> in ${seasonName} on BloxQuiz.gg! Here is your <strong style="color:#00F5A0;">${prizeAmount} Amazon gift card code</strong>:
      </p>

      <div style="background:#0B0E17;border:2px dashed rgba(0,245,160,0.4);border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
        <div style="font-size:11px;font-weight:900;color:rgba(0,245,160,0.6);text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Your Gift Card Code</div>
        <div style="font-size:26px;font-weight:900;color:#00F5A0;letter-spacing:4px;font-family:monospace;">${giftCardCode.trim()}</div>
      </div>

      <div style="background:rgba(255,227,71,0.06);border:1px solid rgba(255,227,71,0.2);border-radius:10px;padding:14px 16px;">
        <div style="font-size:12px;font-weight:900;color:#FFE347;margin-bottom:6px;">📋 How to Redeem</div>
        <ol style="margin:0;padding-left:18px;color:#8892B0;font-size:13px;font-weight:600;line-height:1.8;">
          <li>Go to <a href="https://www.amazon.com/gc/redeem" style="color:#00b4d8;">amazon.com/gc/redeem</a></li>
          <li>Enter the code above</li>
          <li>Use your balance to buy Robux at <a href="https://www.roblox.com" style="color:#00b4d8;">roblox.com</a></li>
        </ol>
      </div>
    </div>

    <div style="text-align:center;margin-bottom:28px;">
      <a href="https://www.bloxquiz.gg" style="display:inline-block;background:linear-gradient(135deg,#00F5A0,#B84CFF);color:#0B0E17;font-weight:900;font-size:16px;padding:16px 40px;border-radius:100px;text-decoration:none;">
        🎮 Keep Playing on BloxQuiz
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
      from: "BloxQuiz <noreply@bloxquiz.gg>",
      to: claim.email,
      subject: `🎁 Your ${prizeAmount} gift card is here — ${seasonName} BloxQuiz`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: "Failed to send email: " + err }, { status: 500 });
  }

  // Update claim status to "sent"
  await supabaseAdmin
    .from("prize_claims")
    .update({ status: "sent" })
    .eq("id", claimId);

  // Update season_results reward_status to "sent"
  await supabaseAdmin
    .from("season_results")
    .update({ reward_status: "sent" })
    .eq("season_id", claim.season_id)
    .eq("user_id", claim.user_id);

  return NextResponse.json({ success: true });
}