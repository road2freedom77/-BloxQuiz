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

// ─── Manual editor slot — update this whenever you want to spotlight something ───
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
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>
                {cardTitle}
              </h3>
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
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>
              {card.title}
            </h3>
            <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, lineHeight: 1.6, marginBottom: 12, flex: 1 }}>
              {card.description}
            </p>
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
      slug: q.slug,
      title: q.title,
      game: q.game,
      difficulty: q.difficulty,
      questions: Array.isArray(q.questions) ? q.questions.length : 10,
      emoji: "🎮",
      thumb: "linear-gradient(135deg, rgba(0,245,160,0.15), rgba(184,76,255,0.15))",
    }));
  } catch { return []; }
}

async function getInitialDaily() {
  try {
    const { data } = await supabaseAdmin
      .from("quizzes")
      .select("slug, title, game, difficulty")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(100);
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
      .from("game_guides")
      .select("slug, title, game_name, game_slug, difficulty, excerpt")
      .eq("status", "published")
      .order("game_slug", { ascending: true });
    if (!data || data.length === 0) return [];
    const seed = parseInt(new Date().toISOString().split("T")[0].replace(/-/g, "")) % data.length;
    const rotated = [...data.slice(seed), ...data.slice(0, seed)];
    return rotated.slice(0, 3);
  } catch { return []; }
}

async function getNewestGuide() {
  try {
    const { data } = await supabaseAdmin
      .from("game_guides")
      .select("slug, title, game_name, game_slug, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    return data ?? null;
  } catch { return null; }
}

async function getTrendingGame() {
  try {
    const { data: games } = await supabaseAdmin
      .from("roblox_games")
      .select("slug, name, current_players, last_updated")
      .eq("is_tracked", true)
      .order("current_players", { ascending: false, nullsFirst: false })
      .limit(20);
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
      <GuidesSection guides={guides} />
      <FreshOnBloxQuiz newestGuide={newestGuide} trendingGame={trendingGame} />
      <GameCategories />
      <UsernameGeneratorBanner />
      <PopularQuizzes initialQuizzes={initialQuizzes} />
      <WhySignUp />
      {showDailyChallenge && <DailyChallenge initialDaily={initialDaily} />}
      <Codes />
      <EmailSignup />
    </>
  );
}