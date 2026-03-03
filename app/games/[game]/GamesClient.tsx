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
  "Grow a Garden": "linear-gradient(135deg, #0a1a0a, #1a4a1a)",
  "Royale High": "linear-gradient(135deg, #2a0a2e, #5c1a5c)",
  "Doors": "linear-gradient(135deg, #1a1a0a, #3a3a1a)",
  "Arsenal": "linear-gradient(135deg, #1a0a0a, #4a1a1a)",
  "Anime Fighting Simulator": "linear-gradient(135deg, #0a0a2e, #1a1a5c)",
  "Berry Avenue": "linear-gradient(135deg, #2a0a1a, #5c1a3a)",
  "Livetopia": "linear-gradient(135deg, #0a1a2a, #1a3a5c)",
  "Natural Disaster Survival": "linear-gradient(135deg, #1a1a0a, #4a3a0a)",
  "Anime Defenders": "linear-gradient(135deg, #0a0a1a, #1a1a4a)",
  "Funky Friday": "linear-gradient(135deg, #1a0a2a, #4a1a5c)",
  "Kick Off": "linear-gradient(135deg, #0a1a0a, #1a4a1a)",
};

const gameEmojis: Record<string, string> = {
  "Blox Fruits": "⚔️",
  "Brookhaven RP": "🏠",
  "Adopt Me!": "🐾",
  "Tower of Hell": "🗼",
  "Murder Mystery 2": "🔫",
  "Grow a Garden": "🌱",
  "Royale High": "👑",
  "Doors": "🚪",
  "Arsenal": "🎯",
  "Anime Fighting Simulator": "🥊",
  "Berry Avenue": "🍓",
  "Livetopia": "🏖️",
  "Natural Disaster Survival": "🌪️",
  "Anime Defenders": "🐉",
  "Funky Friday": "🎵",
  "Kick Off": "⚽",
};

const ANGLE_ORDER = ["Beginner", "Mechanics", "Expert", "Lore", "Trading", "Secrets", "Updates"];
const ANGLE_LABELS: Record<string, string> = {
  Beginner: "🟢 Beginner",
  Mechanics: "⚙️ Mechanics",
  Expert: "🔴 Expert",
  Lore: "📖 Lore",
  Trading: "💰 Trading",
  Secrets: "🔍 Secrets",
  Updates: "🆕 Updates",
};

export default function GamesClient({ quizzes, config, gameSlug }: { quizzes: any[], config: any, gameSlug: string }) {
  const thumb = gameThumbs[config.displayName] || "linear-gradient(135deg, #1a1a2e, #3d1a5c)";

  // Group quizzes by angle
  const grouped: Record<string, any[]> = { Uncategorized: [] };
  for (const angle of ANGLE_ORDER) grouped[angle] = [];

  for (const quiz of quizzes) {
    const angle = quiz.angle;
    if (angle && grouped[angle] !== undefined) {
      grouped[angle].push(quiz);
    } else {
      grouped["Uncategorized"].push(quiz);
    }
  }

  const hasGrouped = ANGLE_ORDER.some(a => grouped[a].length > 0);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Breadcrumbs */}
      <nav style={{ marginBottom: 20, fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <li><a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</a></li>
          <li style={{ color: "var(--text-dim)" }}>›</li>
          <li><a href="/browse" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Quizzes</a></li>
          <li style={{ color: "var(--text-dim)" }}>›</li>
          <li style={{ color: "var(--text)" }}>{config.displayName}</li>
        </ol>
      </nav>

      {/* Hero */}
      <div style={{ borderRadius: "var(--radius)", overflow: "hidden", marginBottom: 32, background: thumb, padding: "40px 36px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{config.emoji}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 8, color: "#fff" }}>{config.displayName} Quizzes</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 15, marginBottom: 20, maxWidth: 600 }}>
            {quizzes.length} quizzes available — test your {config.displayName} knowledge across all difficulty levels!
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={quizzes[0] ? `/quiz/${quizzes[0].slug}` : "/browse"}
              style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
              ⚡ Start First Quiz
            </a>
            <a href="/codes"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
              🎁 {config.displayName} Codes
            </a>
          </div>
        </div>
      </div>

      {/* Intro paragraph — SSR for SEO */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "24px 28px", marginBottom: 32 }}>
        <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, margin: 0 }}>{config.intro}</p>
      </div>

      {/* Quick stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        {[
          { label: "Total Quizzes", value: quizzes.length, color: "var(--neon-blue)" },
          { label: "Easy", value: quizzes.filter(q => q.difficulty === "Easy").length, color: "var(--neon-green)" },
          { label: "Medium", value: quizzes.filter(q => q.difficulty === "Medium").length, color: "var(--neon-yellow)" },
          { label: "Hard", value: quizzes.filter(q => q.difficulty === "Hard").length, color: "var(--neon-pink)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "14px 20px", textAlign: "center", minWidth: 80 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color, marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quizzes — grouped by angle */}
      {quizzes.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontWeight: 700 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Coming Soon!</div>
          <div>We're generating quizzes for {config.displayName} right now.</div>
        </div>
      ) : hasGrouped ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {ANGLE_ORDER.filter(a => grouped[a].length > 0).map(angle => (
            <div key={angle}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>{ANGLE_LABELS[angle]} Quizzes</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {grouped[angle].map(quiz => <QuizCard key={quiz.slug} quiz={quiz} thumb={thumb} emoji={config.emoji} />)}
              </div>
            </div>
          ))}
          {grouped["Uncategorized"].length > 0 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>{"🎮 More Quizzes"}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {grouped["Uncategorized"].map(quiz => <QuizCard key={quiz.slug} quiz={quiz} thumb={thumb} emoji={config.emoji} />)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {quizzes.map(quiz => <QuizCard key={quiz.slug} quiz={quiz} thumb={thumb} emoji={config.emoji} />)}
        </div>
      )}

      {/* Internal links */}
      <div style={{ marginTop: 48, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 16 }}>{"🔗 Explore More"}</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/browse" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>🎮 Browse All Quizzes</a>
          <a href="/codes" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>🎁 Free Roblox Codes</a>
          <a href="/leaderboard" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>🏆 Leaderboard</a>
        </div>
      </div>

      {/* Related games */}
      {config.related && config.related.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>{"🎮 Related Games"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {config.related.map((relatedGame: string) => {
              const relSlug = relatedGame.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              const emoji = gameEmojis[relatedGame] || "🎮";
              return (
                <a key={relatedGame} href={`/games/${relSlug}`}
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px 20px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>{relatedGame}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>View Quizzes →</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz, thumb, emoji }: { quiz: any, thumb: string, emoji: string }) {
  const diff = diffColors[quiz.difficulty] || diffColors.Medium;
  return (
    <a href={`/quiz/${quiz.slug}`} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", cursor: "pointer", textDecoration: "none", display: "block" }}>
      <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, background: thumb, position: "relative" }}>
        {emoji}
        <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 900, color: "var(--neon-green)" }}>▶ PLAY</span>
      </div>
      <div style={{ padding: "14px 16px 18px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: diff.bg, color: diff.color }}>{quiz.difficulty}</span>
          <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "var(--surface)", color: "var(--text-muted)" }}>{quiz.questions} Q's</span>
          {quiz.angle && <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "rgba(184,76,255,0.1)", color: "#B84CFF" }}>{quiz.angle}</span>}
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", margin: 0 }}>{quiz.title}</h3>
      </div>
    </a>
  );
}