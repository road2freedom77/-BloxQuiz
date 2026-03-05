import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contest Rules | BloxQuiz.gg",
  description: "Official rules for the BloxQuiz.gg Season 1 leaderboard contest. Learn how to qualify, win prizes, and claim your Roblox gift card.",
};

export default function RulesPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#B84CFF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Official Contest Rules</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, marginBottom: 12 }}>Season 1 Rules</h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 15, lineHeight: 1.7 }}>
          BloxQuiz.gg Season 1 runs from March 1–31, 2026. Read the full rules before competing.
        </p>
      </div>

      {/* Disclaimer */}
      <div style={{ background: "rgba(255,227,71,0.06)", border: "1px solid rgba(255,227,71,0.2)", borderRadius: "var(--radius)", padding: "16px 20px", marginBottom: 28, fontSize: 13, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7 }}>
        ⚠️ BloxQuiz.gg is an independent fan site. We are <strong style={{ color: "var(--text)" }}>not affiliated with, endorsed by, or sponsored by Roblox Corporation</strong>. "Roblox" and related trademarks are property of Roblox Corporation. Gift cards are purchased independently by BloxQuiz.gg and awarded at our sole discretion.
      </div>

      {[
        {
          emoji: "🏆",
          title: "How the Leaderboard Works",
          items: [
            "Season 1 runs March 1–31, 2026. Scores reset on April 1st.",
            "Points are awarded based on quiz difficulty: Easy = 1x, Medium = 1.5x, Hard = 2x.",
            "Only your first attempt on each quiz counts toward your season score.",
            "A maximum of 20 quizzes per day count toward your season score.",
            "Speed bonuses of up to 15% are available for fast, accurate completions.",
            "Tie-breakers are resolved by: accuracy first, then quizzes completed, then earliest submission time.",
            "If a top 3 player is flagged or disqualified, the next qualifying player moves up.",
          ],
        },
        {
          emoji: "✅",
          title: "How to Qualify for Prizes",
          items: [
            "You must complete at least 10 scored quizzes during the season.",
            "Your account must be at least 24 hours old at the time of season close.",
            "You must have a valid BloxQuiz.gg account with a username set.",
            "Only the top 3 qualifying players win prizes.",
            "You must claim your prize within 14 days of the season ending.",
          ],
        },
        {
          emoji: "🎁",
          title: "Prizes",
          items: [
            "1st Place — $20 Amazon digital Roblox gift card.",
            "2nd Place — $15 Amazon digital Roblox gift card.",
            "3rd Place — $10 Amazon digital Roblox gift card.",
            "Prizes are delivered digitally via email within 7 days of claim submission.",
            "BloxQuiz.gg reserves the right to substitute prizes of equal or greater value.",
          ],
        },
        {
          emoji: "⚠️",
          title: "Disqualification",
          items: [
            "Accounts found to be using bots, scripts, or automation will be permanently disqualified.",
            "Creating multiple accounts to farm scores is not allowed.",
            "Completing quizzes in impossibly fast times will trigger an automatic review.",
            "If top 3 players are disqualified, the next qualifying player moves into prize position.",
            "BloxQuiz.gg admins reserve the right to disqualify any account at their sole discretion.",
            "Disqualification decisions are final and non-appealable.",
          ],
        },
        {
          emoji: "📋",
          title: "Claiming Your Prize",
          items: [
            "Winners are notified via their BloxQuiz.gg profile page.",
            "To claim, visit /rewards/claim and submit your Roblox username and email.",
            "You must provide a valid email address to receive your gift card.",
            "Unclaimed prizes expire 14 days after the season ends.",
            "BloxQuiz.gg is not responsible for prizes lost due to incorrect contact information.",
          ],
        },
        {
          emoji: "⚖️",
          title: "General",
          items: [
            "BloxQuiz.gg reserves the right to modify, suspend, or cancel the contest at any time.",
            "These rules may be updated at any time. Continued participation constitutes acceptance.",
            "This contest is void where prohibited by law.",
            "Employees and immediate family members of BloxQuiz.gg are not eligible.",
            "For questions, contact us via the BloxQuiz.gg Discord or feedback form.",
          ],
        },
      ].map(section => (
        <div key={section.title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "22px 26px", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <span>{section.emoji}</span>
            <span>{section.title}</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {section.items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#B84CFF", fontWeight: 900, fontSize: 14, marginTop: 1, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 24, fontSize: 12, color: "var(--text-dim)", fontWeight: 600, textAlign: "center" }}>
        Last updated: March 1, 2026 · <a href="/leaderboard" style={{ color: "#B84CFF", textDecoration: "none" }}>View Leaderboard →</a>
      </div>

    </div>
  );
}