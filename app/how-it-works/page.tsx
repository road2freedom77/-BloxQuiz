import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How BloxQuiz Works — Features, Scoring & Systems Explained | BloxQuiz",
  description: "Learn how BloxQuiz works — daily challenges, scoring and XP, streaks, code alerts, live stats, and the monthly leaderboard. Everything explained in one place.",
  alternates: { canonical: "https://www.bloxquiz.gg/how-it-works" },
};

const FEATURES = [
  {
    emoji: "⚡",
    title: "Daily Challenge",
    description: "A new quiz drops every day at midnight. One challenge, one chance to prove you know your Roblox.",
    href: "/how-it-works/daily-challenge",
    color: "#ff3cac",
  },
  {
    emoji: "🏆",
    title: "Scoring & XP",
    description: "Every quiz earns points based on difficulty. Hard quizzes pay more. Streaks multiply your gains.",
    href: "/how-it-works/scoring-and-xp",
    color: "#00f5a0",
  },
  {
    emoji: "🎁",
    title: "Code Alerts",
    description: "Follow any game and get an email the moment new codes drop. Never miss a free reward again.",
    href: "/how-it-works/code-alerts",
    color: "#ffe347",
  },
  {
    emoji: "📊",
    title: "Live Stats",
    description: "Real-time player counts for 90+ Roblox games, updated every hour directly from the Roblox API.",
    href: "/how-it-works/live-stats",
    color: "#00b4d8",
  },
  {
    emoji: "👑",
    title: "Leaderboard & Prizes",
    description: "The top players each month win Roblox gift cards. Points reset monthly so everyone has a shot.",
    href: "/how-it-works/leaderboard",
    color: "#b84cff",
  },
];

export default function HowItWorksHub() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px", color: "var(--text)", fontFamily: "var(--font-body)" }}>

      <nav style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 24 }}>
        <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "var(--text-muted)" }}>How It Works</span>
      </nav>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 40px)", marginBottom: 16, lineHeight: 1.1 }}>
        How BloxQuiz Works
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 48, maxWidth: 620 }}>
        BloxQuiz is more than a quiz site. It has a scoring system, streaks, a monthly leaderboard with real prizes, code alerts for your favorite games, and live player count data for 90+ Roblox games. Here's how each feature works.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {FEATURES.map((f) => (
          <a key={f.href} href={f.href} style={{ display: "flex", alignItems: "center", gap: 20, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 28px", textDecoration: "none", transition: "border-color 0.2s" }}>
            <div style={{ fontSize: 36, flexShrink: 0 }}>{f.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.6 }}>{f.description}</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: f.color, whiteSpace: "nowrap", flexShrink: 0 }}>Learn more →</span>
          </a>
        ))}
      </div>

      <div style={{ marginTop: 56, background: "linear-gradient(135deg, rgba(0,245,160,0.06), rgba(184,76,255,0.04))", border: "1px solid rgba(0,245,160,0.15)", borderRadius: 16, padding: "28px 32px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 10 }}>Ready to play?</div>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
          Create a free account to save scores, build streaks, follow games for code alerts, and compete on the leaderboard.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/browse" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>Browse Quizzes</a>
          <a href="/leaderboard" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none" }}>View Leaderboard</a>
        </div>
      </div>

    </div>
  );
}