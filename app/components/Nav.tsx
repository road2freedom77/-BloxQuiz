"use client";

export default function Nav() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(11,14,23,0.85)",
      backdropFilter: "blur(24px)",
      borderBottom: "1px solid var(--border)",
      padding: "0 24px"
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 68
      }}>
        <a href="/" style={{
          fontFamily: "var(--font-display)",
          fontSize: 28, textDecoration: "none",
          background: "var(--gradient-main)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Blox<span style={{
            background: "var(--gradient-fire)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>Quiz</span>
        </a>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a href="#quizzes" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Quizzes</a>
          <a href="#codes" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Codes</a>
          <a href="#leaderboard" style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: 14, fontWeight: 700, padding: "8px 16px", borderRadius: 100 }}>Leaderboard</a>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--surface)", padding: "6px 14px",
            borderRadius: 100, fontSize: 13, fontWeight: 800,
            color: "var(--neon-yellow)",
            border: "1px solid rgba(255,227,71,0.2)"
          }}>🔥 3 Day Streak</div>
          <a href="#" style={{
            background: "var(--gradient-main)",
            color: "var(--bg)", fontWeight: 800, fontSize: 14,
            padding: "8px 20px", borderRadius: 100,
            textDecoration: "none", WebkitTextFillColor: "var(--bg)"
          }}>Play Now</a>
        </div>
      </div>
    </nav>
  );
}