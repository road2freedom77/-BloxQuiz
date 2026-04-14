import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How the Leaderboard & Monthly Prizes Work | BloxQuiz",
  description: "BloxQuiz runs a monthly leaderboard where the top players win Roblox gift cards. Learn how points are counted, when prizes are awarded, and how to climb the rankings.",
  alternates: { canonical: "https://www.bloxquiz.gg/how-it-works/leaderboard" },
};

export default function LeaderboardGuide() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px", color: "var(--text)", fontFamily: "var(--font-body)" }}>

      <nav style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 24 }}>
        <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <a href="/how-it-works" style={{ color: "var(--text-dim)", textDecoration: "none" }}>How It Works</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "var(--text-muted)" }}>Leaderboard</span>
      </nav>

      <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: "#b84cff", marginBottom: 12 }}>Feature Guide</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 5vw, 38px)", marginBottom: 16, lineHeight: 1.1 }}>
        How the Leaderboard & Prizes Work
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 40, maxWidth: 640 }}>
        BloxQuiz runs a monthly leaderboard competition where the top players win real Roblox gift cards. Points accumulate throughout the month and reset at the start of each new season.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>How points accumulate</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 12px" }}>
            Every quiz you complete adds weighted points to your monthly total. Points are calculated based on how many questions you answered correctly and the difficulty of the quiz — Hard quizzes are worth 2x the base points of Easy quizzes.
          </p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            Streak bonuses earned at 3, 7, 14, and 30-day milestones also add directly to your monthly leaderboard total. The more consistently you play, the more your streak multiplies your overall score.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>When does the season reset?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 12px" }}>
            The leaderboard runs on a quarterly season cycle. At the end of each season, the top players are identified, prizes are awarded, and the leaderboard resets to zero. A new season begins and everyone starts fresh.
          </p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            The current season name and status is always shown on the <a href="/leaderboard" style={{ color: "#b84cff", textDecoration: "none" }}>Leaderboard page</a> and on the results screen after each quiz.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>What are the prizes?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 12px" }}>
            The top 3 players at the end of each season win Roblox gift cards. Prize amounts are announced at the start of each season on the leaderboard page and the BloxQuiz rules page.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { place: "🥇 1st", label: "Top prize", color: "#ffe347", bg: "rgba(255,227,71,0.08)", border: "rgba(255,227,71,0.2)" },
              { place: "🥈 2nd", label: "Runner-up", color: "#c0c0c0", bg: "rgba(192,192,192,0.08)", border: "rgba(192,192,192,0.2)" },
              { place: "🥉 3rd", label: "Third place", color: "#cd7f32", bg: "rgba(205,127,50,0.08)", border: "rgba(205,127,50,0.2)" },
            ].map((p) => (
              <div key={p.place} style={{ flex: 1, minWidth: 140, background: p.bg, border: `1px solid ${p.border}`, borderRadius: 12, padding: "20px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{p.place}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: p.color }}>Roblox Gift Card</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginTop: 2 }}>{p.label}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>How are winners notified?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            Winners are contacted via the email address on their BloxQuiz account. Make sure your email address is current so you can be reached if you win. Prize claim instructions are sent directly by email at the end of each season.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>Tips for climbing the leaderboard</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Play Hard quizzes — they earn 2x points compared to Easy quizzes for the same number of correct answers.",
              "Build and maintain your streak. The 7-day streak bonus alone adds 100 points, and the 30-day bonus adds 500.",
              "Aim for perfect scores — every wrong answer is points you're leaving on the table.",
              "Play the Daily Challenge every day — it's a consistent source of points and keeps your streak alive.",
              "Spread plays across the month — the 20-quiz daily cap means playing every day beats cramming at the end.",
            ].map((tip, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <span style={{ color: "#b84cff", fontWeight: 900, flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{tip}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>Full rules</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            The complete leaderboard rules including eligibility requirements, prize claim process, and disqualification criteria are on the <a href="/rules" style={{ color: "#b84cff", textDecoration: "none" }}>Rules page</a>.
          </p>
        </section>

      </div>

      <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/leaderboard" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "14px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>👑 View Leaderboard</a>
        <a href="/rules" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "14px 28px", borderRadius: 100, textDecoration: "none" }}>Full Rules →</a>
      </div>

    </div>
  );
}