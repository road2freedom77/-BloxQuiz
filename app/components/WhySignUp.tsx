"use client";
import { SignUpButton, useUser } from "@clerk/nextjs";

const perks = [
  { emoji: "📊", title: "Save Your Scores", desc: "Track every quiz you play and see your improvement over time." },
  { emoji: "🔥", title: "Keep Your Streak", desc: "Build daily streaks and earn bonus XP for consecutive days." },
  { emoji: "🔔", title: "Get Code Alerts", desc: "Follow your favorite games and get emailed when new codes drop." },
  { emoji: "🏆", title: "Climb the Leaderboard", desc: "Compete monthly for real Roblox gift card prizes." },
  { emoji: "🎖️", title: "Unlock Badges", desc: "Earn badges for streaks, perfect scores, and leaderboard ranks." },
];

export default function WhySignUp() {
  const { isSignedIn } = useUser();

  // Don't show to signed-in users
  if (isSignedIn) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(184,76,255,0.08), rgba(0,245,160,0.05))",
        border: "1px solid rgba(184,76,255,0.2)",
        borderRadius: 20,
        padding: "36px 40px",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <div style={{ maxWidth: 320 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#B84CFF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Free Account Perks</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 30px)", marginBottom: 12, lineHeight: 1.2 }}>
              Create a free account to get more from BloxQuiz
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, marginBottom: 20 }}>
              Save scores, track streaks, follow your favorite Roblox games, and compete for real prizes every month.
            </p>
            <SignUpButton mode="modal">
              <button style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--gradient-main)",
                color: "var(--bg)",
                fontWeight: 900,
                fontSize: 14,
                padding: "12px 28px",
                borderRadius: 100,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                WebkitTextFillColor: "var(--bg)",
              }}>
                🚀 Sign Up Free
              </button>
            </SignUpButton>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, flex: 1, minWidth: 280 }}>
            {perks.map(perk => (
              <div key={perk.title} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: "14px 16px",
              }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{perk.emoji}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text)", marginBottom: 3 }}>{perk.title}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dim)", lineHeight: 1.5 }}>{perk.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}