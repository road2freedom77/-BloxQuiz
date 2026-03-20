"use client";

export default function Hero() {
  const proofBlocks = [
    { value: "353+", label: "Quizzes Across 18 Games", color: "var(--neon-green)" },
    { value: "97",   label: "Active Codes Updated Daily", color: "var(--neon-pink)" },
    { value: "LIVE", label: "Player Counts from Roblox", color: "var(--neon-yellow)" },
  ];

  return (
    <section style={{
      maxWidth: 1200, margin: "0 auto",
      padding: "72px 24px 40px",
      textAlign: "center",
      position: "relative", zIndex: 1
    }}>
      {/* Badges */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, background: "rgba(0,245,160,0.12)", color: "var(--neon-green)" }}>● 353+ Quizzes</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, background: "rgba(255,60,172,0.12)", color: "var(--neon-pink)" }}>● Daily Challenges</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, background: "rgba(255,227,71,0.12)", color: "var(--neon-yellow)" }}>● Free Codes</span>
      </div>

      {/* Headline */}
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

      {/* Subheading */}
      <p style={{ fontSize: 18, color: "var(--text-muted)", maxWidth: 540, margin: "0 auto 36px", fontWeight: 600 }}>
        Test your knowledge on Blox Fruits, Brookhaven, Adopt Me & more. Play quizzes, earn XP, and see live player counts.
      </p>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
        <a href="/quiz/random" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--gradient-main)",
          color: "var(--bg)", fontWeight: 900, fontSize: 16,
          padding: "16px 36px", borderRadius: 100,
          textDecoration: "none", WebkitTextFillColor: "var(--bg)",
          boxShadow: "0 4px 20px rgba(0,245,160,0.25)"
        }}>⚡ Start Random Quiz</a>
        <a href="/browse" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--surface)", color: "var(--text)",
          fontWeight: 800, fontSize: 16,
          padding: "16px 36px", borderRadius: 100,
          textDecoration: "none", border: "1px solid var(--border)"
        }}>🎮 Browse All Quizzes</a>
      </div>

      {/* Proof Blocks */}
      <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
        {proofBlocks.map(({ value, label, color }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 32,
              background: "var(--gradient-main)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>{value}</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}