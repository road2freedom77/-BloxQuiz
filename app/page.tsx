import Hero from "./components/Hero";
import GameCategories from "./components/GameCategories";
import PopularQuizzes from "./components/PopularQuizzes";
import DailyChallenge from "./components/DailyChallenge";
import TrendingGames from "./components/TrendingGames";
import Codes from "./components/Codes";
import EmailSignup from "./components/EmailSignup";
import UsernameGeneratorBanner from "./components/UsernameGeneratorBanner";
import { supabase, supabaseAdmin } from "./lib/supabase";
import WhySignUp from "./components/WhySignUp";

const DAILY_CHALLENGE_THRESHOLD = 50;
const ROBUX_URL = "https://www.amazon.com/s?k=roblox+figures+phatmojo&tag=bloxquiz-20";

// ─── Manual editor slot ───────────────────────────────────────────
const EDITOR_PICK = {
  label: "Editor's Pick",
  emoji: "⚔️",
  title: "Best Blox Fruits Quiz Set",
  description: "34 quizzes covering fruits, combat, trading, and lore — the deepest quiz collection on BloxQuiz.",
  href: "/games/blox-fruits",
  timestamp: "Updated Apr 2026",
};

const GAME_EMOJI: Record<string, string> = {
  "blox-fruits": "⚔️",
  "dress-to-impress": "👗",
  "bee-swarm-simulator": "🐝",
  "doors": "🚪",
  "murder-mystery-2": "🔫",
  "adopt-me": "🐾",
  "brookhaven-rp": "🏠",
  "royale-high": "👑",
  "grow-a-garden": "🌱",
  "tower-of-hell": "🏗️",
  "arsenal": "🎯",
  "berry-avenue": "🏙️",
  "anime-defenders": "⚡",
  "da-hood": "🎯",
  "fisch": "🎣",
};

function formatFreshTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 60) return `Updated ${diffMins}m ago`;
  if (diffHours < 24) return `Updated ${diffHours}h ago`;
  if (diffDays === 1) return "Updated yesterday";
  return `Updated ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

// ─── Affiliate banner — inline card between sections ──────────────
function RobuxInlineBanner({ variant = "default" }: { variant?: "default" | "compact" | "wide" }) {
  if (variant === "compact") {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 32px" }}>
        <a href={ROBUX_URL} target="_blank" rel="noopener sponsored"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,165,0,0.04))", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 12, padding: "14px 20px", textDecoration: "none", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>🧸</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#ffd700", marginBottom: 2 }}>Roblox Toys &amp; Figures on Amazon</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>Phatmojo, Blox Fruits, Adopt Me — free Prime shipping</div>
            </div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#ffd700", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)", padding: "6px 16px", borderRadius: 100, whiteSpace: "nowrap" }}>Shop Amazon →</div>
        </a>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", margin: "6px 0 0", textAlign: "right" }}>BloxQuiz may earn a commission from qualifying Amazon purchases.</p>
      </div>
    );
  }

  if (variant === "wide") {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
        <a href={ROBUX_URL} target="_blank" rel="noopener sponsored"
          style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 24, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", border: "1px solid rgba(255,215,0,0.25)", borderLeft: "3px solid #ffd700", borderRadius: 14, padding: "24px 28px", textDecoration: "none" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#ffd700", marginBottom: 8 }}>🧸 Sponsored — Amazon</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Roblox Toys &amp; Figures</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
              Official Phatmojo mystery figures, Blox Fruits sets, Adopt Me plush, and more. Free Prime shipping on eligible orders.
            </div>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ffd700", color: "#0a0a14", fontWeight: 900, fontSize: 14, padding: "12px 24px", borderRadius: 100, whiteSpace: "nowrap", flexShrink: 0 }}>
            🛒 Shop Now →
          </div>
        </a>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", margin: "6px 0 0", textAlign: "right" }}>BloxQuiz may earn a commission from qualifying Amazon purchases.</p>
      </div>
    );
  }

  // default
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {[
          { emoji: "🧸", label: "Phatmojo Mystery Figures", sub: "Random characters from top Roblox games", url: "https://www.amazon.com/s?k=roblox+phatmojo+figures&tag=bloxquiz-20" },
          { emoji: "⚔️", label: "Blox Fruits Toys & Sets",  sub: "Official Blox Fruits collectibles on Amazon", url: "https://www.amazon.com/s?k=blox+fruits+phatmojo+dlc&tag=bloxquiz-20" },
          { emoji: "🐾", label: "Adopt Me Plush & Figures", sub: "Pets, toys, and accessories from Adopt Me", url: "https://www.amazon.com/s?k=adopt+me+roblox+toys&tag=bloxquiz-20" },
        ].map((item) => (
          <a key={item.label} href={item.url} target="_blank" rel="noopener sponsored"
            style={{ display: "flex", alignItems: "center", gap: 14, background: "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,165,0,0.03))", border: "1px solid rgba(255,215,0,0.18)", borderRadius: 12, padding: "16px 18px", textDecoration: "none" }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>{item.emoji}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#ffd700", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{item.sub}</div>
            </div>
          </a>
        ))}
      </div>
      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", margin: "6px 0 0", textAlign: "right" }}>BloxQuiz may earn a commission from qualifying Amazon purchases.</p>
    </div>
  );
}

function GuidesSection({ guides }: { guides: any[] }) {
  if (guides.length === 0) return null;
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: 0, marginBottom: 4 }}>📖 Roblox Game Guides</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>Beginner tips, strategies, and progression paths for top Roblox games</p>
        </div>
        <a href="/guides" style={{ fontSize: 13, fontWeight: 800, color: "var(--neon-green)", textDecoration: "none", whiteSpace: "nowrap" }}>All Guides →</a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {guides.map((guide: any) => {
          const emoji = GAME_EMOJI[guide.game_slug] || "🎮";
          const cardTitle = guide.title.replace(new RegExp(`^${guide.game_name}[!]?\\s*`, "i"), "").trim();
          return (
            <a key={guide.slug} href={`/guides/${guide.slug}`} style={{ display: "flex", flexDirection: "column", background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 14, padding: "20px", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>{guide.game_name}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "#00f5a0", border: "1px solid rgba(0,245,160,0.2)" }}>{guide.difficulty} Guide</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>{cardTitle}</h3>
              {guide.excerpt && (
                <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, lineHeight: 1.6, marginBottom: 12, flex: 1 }}>{guide.excerpt.substring(0, 90)}...</p>
              )}
              <span style={{ fontSize: 12, fontWeight: 800, color: "#00b4d8" }}>Read Guide →</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function FreshOnBloxQuiz({
  newestGuide,
  trendingGame,
}: {
  newestGuide: { slug: string; title: string; game_name: string; game_slug: string; created_at: string } | null;
  trendingGame: { name: string; slug: string; current_players: number | null; last_updated: string | null } | null;
}) {
  const cards = [
    newestGuide ? {
      label: "New Guide",
      emoji: GAME_EMOJI[newestGuide.game_slug] || "📖",
      title: newestGuide.title.replace(new RegExp(`^${newestGuide.game_name}[!]?\\s*`, "i"), "").trim(),
      description: `A new ${newestGuide.game_name} beginner's guide just landed — tips, strategies, and a full progression path.`,
      href: `/guides/${newestGuide.slug}`,
      timestamp: formatFreshTimestamp(newestGuide.created_at),
    } : null,
    trendingGame ? {
      label: "Trending Now",
      emoji: "📈",
      title: `${trendingGame.name} is moving`,
      description: `${trendingGame.current_players ? `${Math.round(trendingGame.current_players / 1000)}K players online right now.` : "Player count rising."} Check the live stats.`,
      href: `/stats/${trendingGame.slug}`,
      timestamp: trendingGame.last_updated ? formatFreshTimestamp(trendingGame.last_updated) : "Updated hourly",
    } : null,
    {
      label: EDITOR_PICK.label,
      emoji: EDITOR_PICK.emoji,
      title: EDITOR_PICK.title,
      description: EDITOR_PICK.description,
      href: EDITOR_PICK.href,
      timestamp: EDITOR_PICK.timestamp,
    },
  ].filter(Boolean) as { label: string; emoji: string; title: string; description: string; href: string; timestamp: string }[];

  if (cards.length === 0) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: 0, marginBottom: 4 }}>✨ Fresh on BloxQuiz</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>Recently reviewed guides, verified codes, and games moving right now.</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {cards.map((card) => (
          <a key={card.href} href={card.href} style={{ display: "flex", flexDirection: "column", background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 14, padding: "20px", textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 22 }}>{card.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 10px", borderRadius: 100, background: "rgba(0,180,216,0.1)", color: "#00b4d8", border: "1px solid rgba(0,180,216,0.2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {card.label}
              </span>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>{card.title}</h3>
            <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, lineHeight: 1.6, marginBottom: 12, flex: 1 }}>{card.description}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
              <span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{card.timestamp}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "var(--neon-green)" }}>View →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

async function getInitialQuizzes() {
  try {
    const { data } = await supabaseAdmin
      .from("quizzes")
      .select("slug, title, game, difficulty, questions")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(8);
    return (data ?? []).map(q => ({
      slug: q.slug, title: q.title, game: q.game, difficulty: q.difficulty,
      questions: Array.isArray(q.questions) ? q.questions.length : 10,
      emoji: "🎮", thumb: "linear-gradient(135deg, rgba(0,245,160,0.15), rgba(184,76,255,0.15))",
    }));
  } catch { return []; }
}

async function getInitialDaily() {
  try {
    const { data } = await supabaseAdmin
      .from("quizzes").select("slug, title, game, difficulty")
      .eq("status", "published").order("published_at", { ascending: false }).limit(100);
    if (!data || data.length === 0) return null;
    const today = new Date().toISOString().split("T")[0];
    const seed = parseInt(today.replace(/-/g, "")) % data.length;
    const q = data[seed];
    return { slug: q.slug, title: q.title, game: q.game, difficulty: q.difficulty, date: today };
  } catch { return null; }
}

async function getPublishedGuides() {
  try {
    const { data } = await supabaseAdmin
      .from("game_guides").select("slug, title, game_name, game_slug, difficulty, excerpt, created_at")
      .eq("status", "published").order("created_at", { ascending: false }).limit(10);
    if (!data || data.length === 0) return [];
    const seed = parseInt(new Date().toISOString().split("T")[0].replace(/-/g, "")) % data.length;
    const rotated = [...data.slice(seed), ...data.slice(0, seed)];
    return rotated.slice(0, 3);
  } catch { return []; }
}

async function getNewestGuide() {
  try {
    const { data } = await supabaseAdmin
      .from("game_guides").select("slug, title, game_name, game_slug, created_at")
      .eq("status", "published").order("created_at", { ascending: false }).limit(1).single();
    return data ?? null;
  } catch { return null; }
}

async function getTrendingGame() {
  try {
    const { data: games } = await supabaseAdmin
      .from("roblox_games").select("slug, name, current_players, last_updated")
      .eq("is_tracked", true).order("current_players", { ascending: false, nullsFirst: false }).limit(20);
    if (!games || games.length === 0) return null;
    return games[1] ?? games[0];
  } catch { return null; }
}

export default async function Home() {
  const [initialQuizzes, initialDaily, { count: totalPlays }, guides, newestGuide, trendingGame] = await Promise.all([
    getInitialQuizzes(),
    getInitialDaily(),
    supabase.from("plays").select("*", { count: "exact", head: true }),
    getPublishedGuides(),
    getNewestGuide(),
    getTrendingGame(),
  ]);

  const showDailyChallenge = (totalPlays ?? 0) >= DAILY_CHALLENGE_THRESHOLD;

  return (
    <>
      <Hero />
      <TrendingGames />

      {/* Affiliate placement 1 — after trending games, high purchase intent */}
      <RobuxInlineBanner variant="compact" />

      <GuidesSection guides={guides} />
      <FreshOnBloxQuiz newestGuide={newestGuide} trendingGame={trendingGame} />
      <GameCategories />

      {/* Affiliate placement 2 — mid-page, 3-card grid */}
      <RobuxInlineBanner variant="default" />

      <UsernameGeneratorBanner />
      <PopularQuizzes initialQuizzes={initialQuizzes} />

      {/* Affiliate placement 3 — after quizzes, wide card */}
      <RobuxInlineBanner variant="wide" />

      <WhySignUp />
      {showDailyChallenge && <DailyChallenge initialDaily={initialDaily} />}
      <Codes />
      <EmailSignup />
    </>
  );
}