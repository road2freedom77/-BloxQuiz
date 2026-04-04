import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;

export async function POST() {
  // Get all unnotified added codes grouped by game
  const { data: changes } = await supabaseAdmin
    .from("code_change_log")
    .select("id, game_slug, code, change_type, changed_at")
    .eq("change_type", "added")
    .eq("notified", false)
    .order("changed_at", { ascending: false });

  if (!changes || changes.length === 0) {
    return NextResponse.json({ message: "No new codes to notify" });
  }

  // Group by game_slug
  const byGame: Record<string, typeof changes> = {};
  for (const row of changes) {
    if (!byGame[row.game_slug]) byGame[row.game_slug] = [];
    byGame[row.game_slug].push(row);
  }

  const results: { game: string; followers: number; sent: number }[] = [];

  for (const [gameSlug, codes] of Object.entries(byGame)) {
    // Get followers for this game
    const { data: follows } = await supabaseAdmin
      .from("game_follows")
      .select("user_id")
      .eq("game_slug", gameSlug);

    if (!follows || follows.length === 0) {
      // Mark as notified even if no followers
      await supabaseAdmin
        .from("code_change_log")
        .update({ notified: true })
        .in("id", codes.map(c => c.id));
      continue;
    }

    // Get user emails
    const userIds = follows.map(f => f.user_id);
    const { data: users } = await supabaseAdmin
      .from("users")
      .select("id, username, email")
      .in("id", userIds);

    if (!users || users.length === 0) continue;

    // Get game display name
    const { data: gameData } = await supabaseAdmin
      .from("code_games")
      .select("game, icon")
      .eq("slug", gameSlug)
      .single();

    const gameName = gameData?.game || gameSlug;
    const gameIcon = gameData?.icon || "🎮";

    // Get reward details for new codes
    const codeSlugs = codes.map(c => c.code);
    const { data: codeDetails } = await supabaseAdmin
      .from("codes")
      .select("code, reward")
      .eq("slug", gameSlug)
      .in("code", codeSlugs);

    const codeMap: Record<string, string> = {};
    for (const c of codeDetails || []) codeMap[c.code] = c.reward;

    let sent = 0;

    for (const user of users) {
      if (!user.email) continue;

      const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0B0E17;color:#F0F4FF;font-family:sans-serif;margin:0;padding:0;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:48px;margin-bottom:8px;">${gameIcon}</div>
      <h1 style="font-size:24px;font-weight:900;margin:0 0 8px;">New ${gameName} Codes!</h1>
      <p style="color:#8892B0;font-size:15px;font-weight:600;margin:0;">${codes.length} new code${codes.length > 1 ? "s" : ""} just dropped</p>
    </div>

    <div style="background:#13172A;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-bottom:28px;">
      <p style="font-size:15px;font-weight:700;margin:0 0 16px;color:#F0F4FF;">Hey ${user.username || "there"}! 👋</p>
      <p style="font-size:14px;color:#8892B0;font-weight:600;line-height:1.7;margin:0 0 20px;">
        New codes just dropped for <strong style="color:#00F5A0;">${gameName}</strong> — a game you're following on BloxQuiz. Redeem them before they expire!
      </p>

      <div style="display:flex;flex-direction:column;gap:10px;">
        ${codes.map(c => `
          <div style="background:#0B0E17;border:1px solid rgba(0,245,160,0.2);border-radius:10px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:18px;font-weight:900;color:#00F5A0;letter-spacing:2px;font-family:monospace;">${c.code}</div>
              <div style="font-size:12px;color:#8892B0;font-weight:600;margin-top:2px;">→ ${codeMap[c.code] || "Free reward"}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <div style="text-align:center;margin-bottom:28px;">
      <a href="https://www.bloxquiz.gg/codes/${gameSlug}" style="display:inline-block;background:linear-gradient(135deg,#00F5A0,#B84CFF);color:#0B0E17;font-weight:900;font-size:16px;padding:16px 40px;border-radius:100px;text-decoration:none;">
        🎁 Redeem Codes Now
      </a>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;text-align:center;">
      <p style="font-size:12px;color:#4A5568;font-weight:600;margin:0;">
        You're receiving this because you follow ${gameName} on BloxQuiz.<br>
        <a href="https://www.bloxquiz.gg/profile" style="color:#B84CFF;text-decoration:none;">Manage your followed games</a> · 
        <a href="https://www.bloxquiz.gg" style="color:#B84CFF;text-decoration:none;">BloxQuiz.gg</a>
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
          to: user.email,
          subject: `🎁 New ${gameName} codes just dropped — ${codes.length} new code${codes.length > 1 ? "s" : ""}!`,
          html,
        }),
      });

      if (res.ok) sent++;
    }

    // Mark as notified
    await supabaseAdmin
      .from("code_change_log")
      .update({ notified: true })
      .in("id", codes.map(c => c.id));

    results.push({ game: gameName, followers: users.length, sent });
  }

  return NextResponse.json({ success: true, results });
}