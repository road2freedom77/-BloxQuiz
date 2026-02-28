"use client";

export default function Hero() {
  return (
    <section style={{
      maxWidth: 1200, margin: "0 auto",
      padding: "72px 24px 40px",
      textAlign: "center",
      position: "relative", zIndex: 1
    }}>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, background: "rgba(0,245,160,0.12)", color: "var(--neon-green)" }}>● 500+ Quizzes</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, background: "rgba(255,60,172,0.12)", color: "var(--neon-pink)" }}>● Daily Challenges</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, background: "rgba(255,227,71,0.12)", color: "var(--neon-yellow)" }}>● Free Codes</span>
      </div>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(40px, 6vw, 74px)",
        lineHeight: 1.05, letterSpacing: 1,
        marginBottom: 18
      }}>
        How Well Do You<br />
        <span style={{ background: "var(--gradient-main)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Really Know</span>{" "}
        <span style={{ background: "var(--gradient-fire)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Roblox?</span>
      </h1>
      <p style={{ fontSize: 18, color: "var(--text-muted)", maxWidth: 540, margin: "0 auto 36px", fontWeight: 600 }}>
        Test your knowledge on Blox Fruits, Brookhaven, Adopt Me & 50+ more games. Play quizzes, earn XP, climb the leaderboard.
      </p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <a href="/quiz/random" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--gradient-main)",
          color: "var(--bg)", fontWeight: 900, fontSize: 16,
          padding: "16px 36px", borderRadius: 100,
          textDecoration: "none", WebkitTextFillColor: "var(--bg)",
          boxShadow: "0 4px 20px rgba(0,245,160,0.25)"
        }}>⚡ Start Random Quiz</a>
        <a href="#quizzes" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--surface)", color: "var(--text)",
          fontWeight: 800, fontSize: 16,
          padding: "16px 36px", borderRadius: 100,
          textDecoration: "none", border: "1px solid var(--border)"
        }}>🎮 Browse All Quizzes</a>
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "center", gap: 40, padding: "20px 0" }}>
        {[["127K+","Quizzes Played"],["34K","Players"],["500+","Quizzes"],["50+","Games Covered"]].map(([num, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, background: "var(--gradient-main)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{num}</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}