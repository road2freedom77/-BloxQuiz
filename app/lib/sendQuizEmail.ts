export async function sendNewQuizEmail({
    title,
    game,
    difficulty,
    intro,
    slug,
  }: {
    title: string;
    game: string;
    difficulty: string;
    intro?: string;
    slug: string;
  }) {
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
  
    if (!apiKey || !audienceId) {
      console.warn("Resend not configured, skipping email");
      return;
    }
  
    const quizUrl = `https://www.bloxquiz.gg/quiz/${slug}`;
    const diffEmoji = difficulty === "Easy" ? "🟢" : difficulty === "Hard" ? "🔴" : "🟡";
  
    const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background:#0B0E17;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  
      <!-- Header -->
      <div style="text-align:center;margin-bottom:32px;">
        <a href="https://www.bloxquiz.gg" style="font-size:32px;font-weight:900;text-decoration:none;color:#00F5A0;">
          Blox<span style="color:#B84CFF;">Quiz</span>
        </a>
      </div>
  
      <!-- Card -->
      <div style="background:#13172A;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;margin-bottom:24px;">
        <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#B84CFF;margin-bottom:12px;">🎮 New Quiz Drop</div>
        <h1 style="font-size:24px;font-weight:900;color:#F0F4FF;margin:0 0 8px;">${title}</h1>
        <div style="display:flex;gap:10px;margin-bottom:20px;">
          <span style="font-size:12px;font-weight:800;padding:4px 12px;border-radius:100px;background:rgba(0,217,255,0.1);color:#00D9FF;">${game}</span>
          <span style="font-size:12px;font-weight:800;padding:4px 12px;border-radius:100px;background:rgba(255,255,255,0.05);color:#8892B0;">${diffEmoji} ${difficulty}</span>
        </div>
        ${intro ? `<p style="font-size:14px;color:#8892B0;line-height:1.7;margin:0 0 24px;">${intro}</p>` : ""}
        <a href="${quizUrl}" style="display:block;text-align:center;padding:14px 32px;border-radius:100px;background:linear-gradient(135deg,#00F5A0,#B84CFF);color:#0B0E17;font-weight:900;font-size:15px;text-decoration:none;">
          Take the Quiz →
        </a>
      </div>
  
      <!-- Footer -->
      <div style="text-align:center;font-size:12px;color:#4A5568;line-height:1.6;">
        <p>You're receiving this because you subscribed to BloxQuiz updates.</p>
        <p><a href="https://www.bloxquiz.gg/unsubscribe" style="color:#4A5568;text-decoration:underline;">Unsubscribe</a> · <a href="https://www.bloxquiz.gg" style="color:#00F5A0;text-decoration:none;">bloxquiz.gg</a> · Not affiliated with Roblox Corporation</p>
      </div>
  
    </div>
  </body>
  </html>
    `.trim();
  
    try {
      // Step 1: Create broadcast
      const createRes = await fetch("https://api.resend.com/broadcasts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audience_id: audienceId,
          from: "BloxQuiz <noreply@bloxquiz.gg>",
          subject: `🎮 New Quiz Drop — ${title}`,
          html,
          name: `Quiz Drop: ${title}`,
        }),
      });
  
      const broadcast = await createRes.json();
  
      if (!broadcast.id) {
        console.error("Failed to create broadcast:", broadcast);
        return;
      }
  
      // Step 2: Send broadcast
      const sendRes = await fetch(`https://api.resend.com/broadcasts/${broadcast.id}/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });
  
      const result = await sendRes.json();
      console.log("Broadcast sent:", broadcast.id, result);
      return result;
    } catch (err) {
      console.error("Email send failed:", err);
    }
  }