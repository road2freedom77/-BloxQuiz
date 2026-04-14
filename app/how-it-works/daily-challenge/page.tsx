import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How the Daily Challenge Works | BloxQuiz",
  description: "A new Roblox quiz drops on BloxQuiz every day at midnight. Learn how the daily challenge works, what it covers, and why playing every day builds your streak.",
  alternates: { canonical: "https://www.bloxquiz.gg/how-it-works/daily-challenge" },
};

export default function DailyChallengeGuide() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px", color: "var(--text)", fontFamily: "var(--font-body)" }}>

      <nav style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 24 }}>
        <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <a href="/how-it-works" style={{ color: "var(--text-dim)", textDecoration: "none" }}>How It Works</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <span style={{ color: "var(--text-muted)" }}>Daily Challenge</span>
      </nav>

      <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--neon-pink)", marginBottom: 12 }}>Feature Guide</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 5vw, 38px)", marginBottom: 16, lineHeight: 1.1 }}>
        How the Daily Challenge Works
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 40, maxWidth: 640 }}>
        Every day at midnight, BloxQuiz selects a new quiz as the Daily Challenge. It's the same quiz for every player that day — one shared test of Roblox knowledge that resets every 24 hours.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>What is the Daily Challenge?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            The Daily Challenge is a featured quiz that changes every day. It covers a different Roblox game each day — one day it might be a Blox Fruits quiz, the next it could be Doors, Adopt Me, or Royale High. The difficulty varies too, so some days will be easy warm-ups and others will genuinely challenge even experienced players.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>When does it reset?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 12px" }}>
            The Daily Challenge resets every day at midnight. Once a new day begins, the previous challenge is replaced with a fresh quiz. There's no way to go back and complete a challenge you missed — each one is only available for 24 hours.
          </p>
          <div style={{ background: "rgba(255,227,71,0.08)", border: "1px solid rgba(255,227,71,0.2)", borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--neon-yellow)" }}>⚠️ Missed challenges don't carry over — there's no way to catch up on a day you skipped.</div>
          </div>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>How does it affect your streak?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: "0 0 16px" }}>
            Playing any quiz on BloxQuiz counts toward your streak — not just the Daily Challenge. But the Daily Challenge is the easiest way to make sure you play every day, since it's always front and centre on the homepage.
          </p>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            Your streak increases by 1 each day you play at least one quiz. Reaching streak milestones at 3, 7, 14, and 30 days earns bonus leaderboard points on top of your quiz score. Miss a day and your streak resets to zero.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>Does it earn leaderboard points?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            Yes — the Daily Challenge earns the same leaderboard points as any other quiz. Points are based on your score and the quiz difficulty. A perfect score on a Hard Daily Challenge earns significantly more points than an Easy one. Points are added to your monthly total and count toward the leaderboard standings.
          </p>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 14 }}>Do I need an account?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, margin: 0 }}>
            Anyone can play the Daily Challenge without an account. However, your score won't be saved, your streak won't be tracked, and you won't earn leaderboard points unless you're signed in. Creating a free account takes less than a minute and unlocks all of those features.
          </p>
        </section>

      </div>

      <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/daily" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "14px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>⚡ Today's Challenge</a>
        <a href="/how-it-works/scoring-and-xp" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "14px 28px", borderRadius: 100, textDecoration: "none" }}>How Scoring Works →</a>
      </div>

    </div>
  );
}