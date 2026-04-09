export const metadata = {
  title: "About BloxQuiz — Roblox Quizzes, Live Stats, Codes & Guides",
  description: "BloxQuiz covers 95+ Roblox games with free quizzes, hourly live stats, verified codes, and beginner guides. Learn how our data is sourced and why players trust us.",
  alternates: { canonical: "https://www.bloxquiz.gg/about" },
  robots: { index: true },
};

const STATS = [
  { value: "95+", label: "Games Tracked" },
  { value: "550+", label: "Free Quizzes" },
  { value: "Hourly", label: "Stats Updates" },
  { value: "15", label: "Game Guides" },
];

const CONTENT_TYPES = [
  {
    emoji: "🧠",
    title: "Quizzes",
    body: "400+ free trivia quizzes across 95+ Roblox games. Every quiz is 10 questions, takes under 5 minutes, and covers a specific angle — beginner basics, advanced mechanics, lore, trading, or update history. Quizzes are drafted using current game wikis, community knowledge, and patch notes, then reviewed for factual accuracy before publication.",
  },
  {
    emoji: "📊",
    title: "Live Player Stats",
    body: "BloxQuiz tracks hourly player counts, 24-hour peaks, total visits, favorites, and ranking data for 95+ Roblox games. Stats are pulled from the Roblox API and updated every hour. History pages show 14-day trends, volatility scores, weekend lift, and 7-day averages — useful for players deciding when to play and for tracking how games grow over time.",
  },
  {
    emoji: "🎁",
    title: "Verified Codes",
    body: "Active codes are verified before publication and tagged with a last-checked date. Expired codes are separated from active ones so players never waste time on dead codes. We track codes across 95+ games and update them when new codes drop or existing ones expire.",
  },
  {
    emoji: "📖",
    title: "Game Guides",
    body: "Beginner guides for the most popular Roblox games, covering getting started, key mechanics, best early strategies, common mistakes, and a clear progression path. Every guide includes a last-reviewed date and is updated when major patches change core mechanics. Guides are written for players who want to improve, not just for search engines.",
  },
];

const TRUST = [
  {
    emoji: "🔍",
    title: "How quiz content is sourced",
    body: "Quiz questions are drafted using current game wikis, official patch notes, Roblox Developer Forum announcements, and community resources. Each quiz is reviewed for factual accuracy before being published. Flagged questions are removed or corrected — players can flag any question directly from the quiz interface.",
  },
  {
    emoji: "📡",
    title: "How stats data is sourced",
    body: "Player counts, visit totals, favorites, and game rankings come directly from the Roblox API. BloxQuiz stores snapshots hourly and calculates trend metrics like 7-day averages, volatility, and weekend lift from that historical data. Written analysis on stats pages reflects what the numbers show — not speculation about causes.",
  },
  {
    emoji: "✅",
    title: "How codes are verified",
    body: "Codes are tested in-game before being listed as active. Each codes page shows a last-verified timestamp so players know exactly how fresh the data is. When codes expire, they are moved to the expired section rather than deleted, so players can see what used to work.",
  },
  {
    emoji: "🤖",
    title: "Our use of AI",
    body: "BloxQuiz uses AI assistance in drafting quiz questions and guide content. All AI-assisted content is reviewed by a human editor before publication for factual accuracy, appropriate tone, and usefulness to players. We follow Google's guidance on AI-assisted content: the standard is whether it is helpful and accurate, not how it was produced.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px 80px", position: "relative", zIndex: 1 }}>

      {/* Breadcrumb */}
      <nav style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 28 }}>
        <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "var(--text-muted)" }}>About</span>
      </nav>

      {/* Hero */}
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 5vw, 48px)", marginBottom: 16, lineHeight: 1.1 }}>
        About BloxQuiz 🎮
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 17, fontWeight: 600, marginBottom: 40, lineHeight: 1.7, maxWidth: 680 }}>
        BloxQuiz is a free Roblox resource covering 95+ games with quizzes, hourly live stats, verified codes, and beginner guides. Everything on the site is designed to help players learn, track, and enjoy Roblox games — not just to rank in search.
      </p>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 56 }}>
        {STATS.map(({ value, label }) => (
          <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--neon-green)", marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-dim)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* What BloxQuiz covers */}
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 20, color: "var(--neon-green)" }}>What BloxQuiz Covers</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 56 }}>
        {CONTENT_TYPES.map(({ emoji, title, body }) => (
          <div key={title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>{emoji}</span>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, margin: 0 }}>{title}</h3>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 15, fontWeight: 600, lineHeight: 1.8, margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>

      {/* How we source data */}
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 8, color: "var(--neon-green)" }}>How We Source Our Data</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 15, fontWeight: 600, lineHeight: 1.7, marginBottom: 24 }}>
        Accuracy matters more than volume. Here is how each content type on BloxQuiz is sourced and reviewed.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 56 }}>
        {TRUST.map(({ emoji, title, body }) => (
          <div key={title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{emoji}</span>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, margin: "0 0 6px" }}>{title}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 600, lineHeight: 1.8, margin: 0 }}>{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px 32px", marginBottom: 40 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 10 }}>Our Mission</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 15, fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
          BloxQuiz exists to make Roblox more enjoyable for players who want to go deeper than just playing. Whether you want to test your knowledge, track which games are growing, find a working code, or learn how to play a new game faster — BloxQuiz puts those tools in one place, free, with no sign-up required to start. Sign up to save scores, track streaks, and compete on the global leaderboard.
        </p>
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, lineHeight: 1.7, marginBottom: 48 }}>
        BloxQuiz is an independent fan site and is not affiliated with, endorsed by, or connected to Roblox Corporation in any way. Roblox and all related game names are trademarks of their respective owners.
      </p>

      {/* CTA */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/browse" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "13px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>Browse All Quizzes →</a>
        <a href="/guides" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "13px 28px", borderRadius: 100, textDecoration: "none" }}>Game Guides →</a>
        <a href="/editorial" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "13px 28px", borderRadius: 100, textDecoration: "none" }}>Editorial Standards →</a>
      </div>

    </div>
  );
}