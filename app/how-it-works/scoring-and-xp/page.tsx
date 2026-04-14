import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Scoring & XP Work | BloxQuiz",
  description: "Learn how BloxQuiz scoring works — difficulty multipliers, weighted points, streak bonuses, XP, and the daily cap. Everything that affects your leaderboard score explained.",
  alternates: { canonical: "https://www.bloxquiz.gg/how-it-works/scoring-and-xp" },
};

export default function ScoringGuide() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px", color: "var(--text)", fontFamily: "var(--font-body)" }}>

      <nav style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 24 }}>
        <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <a href="/how-it-works" style={{ color: "var(--text-dim)", textDecoration: "none" }}>How It Works</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "var(--text-muted)" }}>Scoring & XP</span>
      </nav>

      <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--neon-green)", marginBottom: 12 }}>Feature Guide</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 5vw, 38px)", marginBottom: 16, lineHeight: 1.1 }}>
        How Scoring & XP Work
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 40, maxWidth: 640 }}>
        BloxQuiz has a points system that rewards both accuracy and consistency. Harder quizzes pay more, longer streaks earn bonuses, and your total score determines where you rank on the monthly leaderboard.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>Base Points</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 16px" }}>
            Every correct answer earns 10 base points. A perfect score on a 10-question quiz earns 100 base points before any multipliers are applied.
          </p>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase" }}>Correct Answers</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase" }}>Base Points</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase" }}>Quiz Size</div>
            </div>
            {[["10/10", "100 pts", "10 questions"], ["7/10", "70 pts", "10 questions"], ["5/10", "50 pts", "10 questions"]].map(([a, b, c], i) => (
              <div key={i} style={{ padding: "12px 20px", borderBottom: i < 2 ? "1px solid var(--border)" : "none", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{a}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--neon-green)" }}>{b}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>{c}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>Difficulty Multipliers</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 16px" }}>
            Base points are multiplied by the quiz difficulty. Hard quizzes are worth twice as much as Easy ones — so if you want to climb the leaderboard fast, tackling harder quizzes is the most efficient path.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Easy", mult: "1x", color: "var(--neon-green)", bg: "rgba(0,245,160,0.08)", border: "rgba(0,245,160,0.2)" },
              { label: "Medium", mult: "1.5x", color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.08)", border: "rgba(255,227,71,0.2)" },
              { label: "Hard", mult: "2x", color: "var(--neon-pink)", bg: "rgba(255,60,172,0.08)", border: "rgba(255,60,172,0.2)" },
            ].map((d) => (
              <div key={d.label} style={{ flex: 1, minWidth: 140, background: d.bg, border: `1px solid ${d.border}`, borderRadius: 12, padding: "20px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: d.color, fontFamily: "var(--font-display)", marginBottom: 4 }}>{d.mult}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: d.color }}>{d.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginTop: 12 }}>
            Example: A perfect score on a Hard 10-question quiz earns 100 × 2 = 200 leaderboard points.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>Streak Bonuses</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 16px" }}>
            Playing every day builds your streak. When you hit a streak milestone, you earn a one-time bonus added directly to your leaderboard score on that day.
          </p>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase" }}>Streak</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase" }}>Bonus Points</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase" }}>Notes</div>
            </div>
            {[
              ["3 days 🔥", "+25 pts", "First milestone"],
              ["7 days 🔥🔥", "+100 pts", "One week"],
              ["14 days 🔥🔥🔥", "+200 pts", "Two weeks"],
              ["30 days 🔥🔥🔥🔥", "+500 pts", "One month"],
            ].map(([streak, bonus, note], i, arr) => (
              <div key={i} style={{ padding: "12px 20px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{streak}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--neon-yellow)" }}>{bonus}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dim)" }}>{note}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginTop: 12 }}>
            Streak bonuses only trigger once per milestone. If you break your streak and rebuild it, you earn the bonus again when you reach the milestone.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>XP vs Leaderboard Points</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 12px" }}>
            BloxQuiz tracks two separate things: XP and leaderboard points. They're related but different.
          </p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text)" }}>XP</strong> is your all-time total. It never resets and reflects your overall activity on BloxQuiz. You earn XP equal to your correct answers × 10.
          </p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: "var(--text)" }}>Leaderboard points</strong> are your monthly total — weighted score plus streak bonuses. These reset at the start of each month, giving everyone a fresh shot at the top spot.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>The Daily Cap</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            To keep the leaderboard fair, there's a limit of 20 scored quizzes per day. After you've completed 20 quizzes in a single day, additional quizzes won't earn leaderboard points — though you can still play for fun. The cap resets at midnight each day.
          </p>
        </section>

      </div>

      <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/leaderboard" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "14px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>👑 View Leaderboard</a>
        <a href="/how-it-works/leaderboard" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "14px 28px", borderRadius: 100, textDecoration: "none" }}>How the Leaderboard Works →</a>
      </div>

    </div>
  );
}