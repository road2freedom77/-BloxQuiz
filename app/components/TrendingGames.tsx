import { supabase } from "../lib/supabase";

interface GameRow {
  universe_id: number;
  name: string;
  slug: string;
  emoji: string;
  current_players: number;
  quiz_count: number;
}

async function getTrendingGames(): Promise<GameRow[]> {
  try {
    const [{ data: games }, { data: quizCounts }] = await Promise.all([
      supabase
        .from("roblox_games")
        .select("universe_id, name, slug, emoji, current_players")
        .eq("is_tracked", true)
        .order("current_players", { ascending: false })
        .limit(8),
      supabase
        .from("quizzes")
        .select("game")
        .eq("status", "published"),
    ]);

    const countMap: Record<string, number> = {};
    for (const q of quizCounts ?? []) {
      countMap[q.game] = (countMap[q.game] ?? 0) + 1;
    }

    return (games ?? []).map(g => ({
      ...g,
      quiz_count: countMap[g.name] ?? 0,
    }));
  } catch {
    return [];
  }
}

function formatPlayers(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default async function TrendingGames() {
  const games = await getTrendingGames();
  if (!games.length) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--neon-green)", marginBottom: 4 }}>
            🔴 Live Data
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: 0 }}>
            Trending Games
          </h2>
        </div>
        <a href="/browse" style={{ fontSize: 13, fontWeight: 800, color: "var(--text-muted)", textDecoration: "none" }}>
          View All →
        </a>
      </div>

      <div style={{
        display: "flex",
        gap: 16,
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        paddingBottom: 12,
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}>
        {games.map(game => (
          
            <a key={game.universe_id} href={`/games/${game.slug}`} style={{
              scrollSnapAlign: "start",
              minWidth: 200,
              flex: "0 0 200px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "20px 16px",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 36, lineHeight: 1 }}>{game.emoji || "🎮"}</div>
            <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.3 }}>{game.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--neon-green)",
                boxShadow: "0 0 6px var(--neon-green)",
                display: "inline-block",
              }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--neon-green)" }}>
                {formatPlayers(game.current_players)} playing
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700, marginTop: "auto" }}>
              {game.quiz_count > 0 ? `${game.quiz_count} quiz${game.quiz_count !== 1 ? "zes" : ""}` : "Coming soon"}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}