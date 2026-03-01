"use client";

const diffColors: Record<string, { color: string, bg: string }> = {
  Easy: { color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" },
  Medium: { color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" },
  Hard: { color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" },
};

const gameThumbs: Record<string, string> = {
  "Blox Fruits": "linear-gradient(135deg, #1a0a2e, #3d1a5c)",
  "Brookhaven RP": "linear-gradient(135deg, #0a1628, #1a3a5c)",
  "Adopt Me!": "linear-gradient(135deg, #2a1a0a, #5c3a1a)",
  "Tower of Hell": "linear-gradient(135deg, #0a1a0a, #1a3a1a)",
  "Murder Mystery 2": "linear-gradient(135deg, #1a0a0a, #3a1a1a)",
  "Grow a Garden": "linear-gradient(135deg, #0a1a0a, #1a3a1a)",
};

export default function GamesClient({ quizzes, config, gameSlug }: { quizzes: any[], config: any, gameSlug: string }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>← Home</a>
      <div style={{ margin: "20px 0 32px" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{config.emoji}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, marginBottom: 8 }}>{config.displayName} Quizzes</h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>{quizzes.length} quizzes available — test your {config.displayName} knowledge!</p>
      </div>

      {quizzes.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontWeight: 700 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Coming Soon!</div>
          <div>We're generating quizzes for {config.displayName} right now.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {quizzes.map((quiz) => {
            const diff = diffColors[quiz.difficulty] || diffColors.Medium;
            const thumb = gameThumbs[quiz.game] || "linear-gradient(135deg, #1a1a2e, #3d1a5c)";
            return (
              <a href={`/quiz/${quiz.slug}`} key={quiz.slug} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", cursor: "pointer", textDecoration: "none", display: "block" }}>
                <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, background: thumb, position: "relative" }}>
                  {config.emoji}
                  <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 900, color: "var(--neon-green)" }}>▶ PLAY</span>
                </div>
                <div style={{ padding: "14px 16px 18px" }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: diff.bg, color: diff.color }}>{quiz.difficulty}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "var(--surface)", color: "var(--text-muted)" }}>{quiz.questions} Q's</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{quiz.title}</h3>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}