"use client";
import { useState, useEffect } from "react";

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
  Expert: "🧠 Expert",
  Lore: "📜 Lore",
  Trading: "💰 Trading",
  Secrets: "🔍 Secrets",
  Updates: "🆕 Updates",
};

function inferAngle(quiz: any): string | null {
  if (quiz.angle) return quiz.angle;
  const text = (quiz.title + " " + quiz.slug).toLowerCase();
  if (text.includes("beginner") || text.includes("basics") || text.includes("starter") ||
      text.includes("essentials") || text.includes("introduction") || text.includes("intro") ||
      text.includes("new player") || text.includes("getting started")) return "Beginner";
  if (text.includes("trading") || text.includes("trade") || text.includes("market") ||
      text.includes("value") || text.includes("economy") || text.includes("price")) return "Trading";
  if (text.includes("mechanic") || text.includes("combat") || text.includes("system") ||
      text.includes("ability") || text.includes("skill") || text.includes("technique") ||
      text.includes("move") || text.includes("build") || text.includes("awakening")) return "Mechanics";
  if (text.includes("expert") || text.includes("advanced") || text.includes("mastery") ||
      text.includes("ultimate") || text.includes("master") || text.includes("pro") ||
      text.includes("endgame") || text.includes("intermediate") || text.includes("knowledge")) return "Expert";
  if (text.includes("lore") || text.includes("story") || text.includes("history") ||
      text.includes("character") || text.includes("world") || text.includes("legend") ||
      text.includes("myth") || text.includes("origin")) return "Lore";
  if (text.includes("secret") || text.includes("hidden") || text.includes("easter egg") ||
      text.includes("mystery") || text.includes("unknown") || text.includes("rare") ||
      text.includes("discovery")) return "Secrets";
  if (text.includes("update") || text.includes("new content") || text.includes("latest") ||
      text.includes("recent") || text.includes("patch") || text.includes("season") ||
      text.includes("event")) return "Updates";
  return null;
}

function formatNumber(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

function QuizCard({ quiz, thumb, emoji }: { quiz: any, thumb: string, emoji: string }) {
  const diff = diffColors[quiz.difficulty] || diffColors.Medium;
  const displayAngle = inferAngle(quiz);
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
          {displayAngle && (
            <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "rgba(184,76,255,0.1)", color: "#B84CFF" }}>{displayAngle}</span>
          )}
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", margin: 0 }}>{quiz.title}</h3>
      </div>
    </a>
  );
}

function getStartQuiz(quizzes: any[]): string {
  if (quizzes.length === 0) return "/browse";
  const easy = quizzes.find(q => q.difficulty === "Easy");
  if (easy) return `/quiz/${easy.slug}`;
  return `/quiz/${quizzes[0].slug}`;
}

function StatsCard({ gameSlug, currentPlayers, totalVisits }: { gameSlug: string; currentPlayers: number | null; totalVisits: number | null }) {
  if (!currentPlayers && !totalVisits) return null;
  return (
    <a
      href={`/stats/${gameSlug}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        background: "linear-gradient(135deg, #0d1f3c 0%, #0f2744 100%)",
        border: "1px solid rgba(0,180,216,0.25)",
        borderRadius: "var(--radius)",
        padding: "16px 24px",
        textDecoration: "none",
        marginBottom: 32,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {currentPlayers && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(0,180,216,0.8)", marginBottom: 2 }}>
              Playing Now
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#00b4d8", fontVariantNumeric: "tabular-nums" }}>
              {formatNumber(currentPlayers)}
            </div>
          </div>
        )}
        {totalVisits && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>
              Total Visits
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "rgba(255,255,255,0.7)", fontVariantNumeric: "tabular-nums" }}>
              {formatNumber(totalVisits)}
            </div>
          </div>
        )}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#00b4d8", whiteSpace: "nowrap" }}>
        📊 View Live Stats →
      </div>
    </a>
  );
}

export default function GamesClient({ quizzes, config, gameSlug, statsData }: {
  quizzes: any[],
  config: any,
  gameSlug: string,
  statsData: { currentPlayers: number | null; totalVisits: number | null } | null,
}) {
  const thumb = gameThumbs[config.displayName] || "linear-gradient(135deg, #1a1a2e, #3d1a5c)";
  const startQuiz = getStartQuiz(quizzes);
  const [randomSlug, setRandomSlug] = useState<string>("");

  useEffect(() => {
    if (quizzes.length > 0) {
      const random = quizzes[Math.floor(Math.random() * quizzes.length)];
      setRandomSlug(random.slug);
    }
  }, []);

  const grouped: Record<string, any[]> = { Uncategorized: [] };
  for (const angle of ANGLE_ORDER) grouped[angle] = [];
  for (const quiz of quizzes) {
    const angle = inferAngle(quiz);
    if (angle && grouped[angle] !== undefined) grouped[angle].push(quiz);
    else grouped["Uncategorized"].push(quiz);
  }
  const hasGrouped = ANGLE_ORDER.some(a => grouped[a].length > 0);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" style={{ marginBottom: 20 }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>
          <li><a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</a></li>
          <li>›</li>
          <li><a href="/browse" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Roblox Games</a></li>
          <li>›</li>
          <li style={{ color: "var(--text)" }}>{config.displayName} Quizzes</li>
        </ol>
      </nav>

      {/* Hero banner */}
      <div style={{ borderRadius: "var(--radius)", overflow: "hidden", marginBottom: 32, background: thumb, padding: "40px 36px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{config.emoji}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 42px)", marginBottom: 8, color: "#fff" }}>
            {config.displayName} Quizzes — Test Your Roblox Knowledge
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 15, marginBottom: 20, maxWidth: 600 }}>
            {quizzes.length} quizzes available — test your {config.displayName} knowledge across all difficulty levels!
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={startQuiz}
              style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
              ⚡ Start Easiest Quiz
            </a>
            {randomSlug && (
              <a href={`/quiz/${randomSlug}`}
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                🎲 Random Quiz
              </a>
            )}
            <a href="/codes"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              🎁 Free Roblox Codes
            </a>
          </div>
        </div>
      </div>

      {/* Stats cross-link card */}
      {statsData && (
        <StatsCard
          gameSlug={gameSlug}
          currentPlayers={statsData.currentPlayers}
          totalVisits={statsData.totalVisits}
        />
      )}

      {/* Intro paragraph */}
      <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 40 }}>{config.intro}</p>

      {/* What is section */}
      {config.whatIs && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>{"What Is Roblox " + config.displayName + "?"}</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>{config.whatIs}</p>
        </div>
      )}

      {/* What quizzes test */}
      {config.whatTests && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>{"What Do " + config.displayName + " Quizzes Test?"}</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 16 }}>{config.whatTests}</p>
          {config.topics && config.topics.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {config.topics.map((topic: string) => (
                <li key={topic} style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", lineHeight: 1.6 }}>{topic}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Stats row */}
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

      {/* Quiz collection */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 24 }}>{config.displayName + " Quiz Collection"}</h2>

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
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 16 }}>{ANGLE_LABELS[angle] + " Quizzes"}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {grouped[angle].map(quiz => <QuizCard key={quiz.slug} quiz={quiz} thumb={thumb} emoji={config.emoji} />)}
                </div>
              </div>
            ))}
            {grouped["Uncategorized"].length > 0 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 16 }}>{"🎮 More " + config.displayName + " Quizzes"}</h3>
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
      </div>

      {/* Why play */}
      {config.whyPlay && (
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>{"Why Play Roblox " + config.displayName + " Quizzes?"}</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>{config.whyPlay}</p>
        </div>
      )}

      {/* Explore more */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16 }}>{"Explore More Roblox Game Quizzes"}</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/browse" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>🎮 Browse All Quizzes</a>
          <a href="/codes" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>🎁 Free Roblox Codes</a>
          <a href="/leaderboard" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>🏆 Leaderboard</a>
          <a href={`/stats/${gameSlug}`} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>📊 Live Stats</a>
        </div>
      </div>

      {/* Related games */}
      {config.related && config.related.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16 }}>{"Related Roblox Game Quizzes"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {config.related.map((relatedGame: string) => {
              const relSlug = relatedGame.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              const emoji = gameEmojis[relatedGame] || "🎮";
              return (
                <a key={relatedGame} href={`/games/${relSlug}`}
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px 20px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>{relatedGame} Quizzes</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>View Collection →</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* FAQ */}
      {config.faqs && config.faqs.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16 }}>{"Frequently Asked Questions"}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {config.faqs.map((faq: any, i: number) => (
              <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "18px 22px" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Freshness signal */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "24px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>🔄</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 8 }}>{"New " + config.displayName + " Quizzes Added Regularly"}</h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
          {"New quizzes are added to BloxQuiz frequently as " + config.displayName + " evolves and updates introduce new content, mechanics, and features. Check back often to challenge yourself with fresh " + config.displayName + " trivia."}
        </p>
      </div>

    </div>
  );
}