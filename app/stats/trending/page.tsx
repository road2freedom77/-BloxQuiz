import Link from "next/link";
import { supabaseAdmin } from "../../lib/supabase";

export const revalidate = 3600;

export const metadata = {
  title: "Trending Roblox Games 2026 — Fastest Growing by Player Count | BloxQuiz",
  description:
    "The fastest growing Roblox games right now ranked by player count growth. See which games are gaining the most players this week. Updated daily.",
  alternates: { canonical: "https://www.bloxquiz.gg/stats/trending" },
  openGraph: {
    title: "Trending Roblox Games 2026 — Fastest Growing | BloxQuiz",
    description: "The fastest growing Roblox games ranked by player count growth. Updated daily.",
    url: "https://www.bloxquiz.gg/stats/trending",
    siteName: "BloxQuiz",
    type: "website",
  },
};

interface GameRow {
  slug: string;
  name: string;
  emoji: string | null;
  genre: string | null;
  thumbnail_url: string | null;
  current_players: number | null;
  total_visits: number | null;
  last_updated: string | null;
  universe_id: number;
}

interface DailyStatRow {
  universe_id: number;
  date: string;
  avg_players: number;
  peak_players: number;
  total_visits_delta: number;
}

interface TrendingGame extends GameRow {
  avgToday: number;
  avgYesterday: number;
  playerDelta: number;
  growthPct: number;
  visitsGained: number;
}

function formatNumber(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

function formatVisits(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

async function getTrendingGames(): Promise<TrendingGame[]> {
  const [{ data: games }, { data: dailyStats }] = await Promise.all([
    supabaseAdmin
      .from("roblox_games")
      .select("slug, name, emoji, genre, thumbnail_url, current_players, total_visits, last_updated, universe_id")
      .eq("is_tracked", true),
    supabaseAdmin
      .from("game_daily_stats")
      .select("universe_id, date, avg_players, peak_players, total_visits_delta")
      .order("date", { ascending: false })
      .limit(200), // last ~5-6 days for all 18 games
  ]);

  if (!games || !dailyStats) return [];

  // Group daily stats by universe_id
  const statsByGame: Record<number, DailyStatRow[]> = {};
  for (const stat of dailyStats as DailyStatRow[]) {
    if (!statsByGame[stat.universe_id]) statsByGame[stat.universe_id] = [];
    statsByGame[stat.universe_id].push(stat);
  }

  const trending: TrendingGame[] = [];

  for (const game of games as GameRow[]) {
    const stats = statsByGame[game.universe_id] ?? [];
    if (stats.length < 2) continue; // need at least 2 days

    const today = stats[0];
    const yesterday = stats[1];

    if (!today || !yesterday || !yesterday.avg_players) continue;

    const playerDelta = today.avg_players - yesterday.avg_players;
    const growthPct = (playerDelta / yesterday.avg_players) * 100;

    trending.push({
      ...game,
      avgToday: today.avg_players,
      avgYesterday: yesterday.avg_players,
      playerDelta,
      growthPct,
      visitsGained: today.total_visits_delta ?? 0,
    });
  }

  // Sort by absolute player delta descending
  return trending.sort((a, b) => b.playerDelta - a.playerDelta);
}

export default async function TrendingPage() {
  const games = await getTrendingGames();
  const topGame = games[0];
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const gainers = games.filter(g => g.playerDelta > 0);
  const losers = games.filter(g => g.playerDelta < 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bloxquiz.gg" },
          { "@type": "ListItem", position: 2, name: "Stats", item: "https://www.bloxquiz.gg/stats" },
          { "@type": "ListItem", position: 3, name: "Trending", item: "https://www.bloxquiz.gg/stats/trending" },
        ],
      },
      {
        "@type": "Article",
        headline: `Trending Roblox Games — ${month}`,
        dateModified: new Date().toISOString(),
        author: { "@type": "Organization", name: "BloxQuiz" },
        publisher: { "@type": "Organization", name: "BloxQuiz" },
        description: "Fastest growing Roblox games ranked by player count growth day over day.",
        mainEntityOfPage: "https://www.bloxquiz.gg/stats/trending",
      },
      ...(games.length > 0 ? [{
        "@type": "ItemList",
        name: `Trending Roblox Games — ${month}`,
        itemListElement: gainers.slice(0, 10).map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: g.name,
          url: `https://www.bloxquiz.gg/stats/${g.slug}`,
        })),
      }] : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(180deg, #0f0f23 0%, #0a0a14 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "48px 0 40px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
            <nav style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24, display: "flex", gap: 6, alignItems: "center" }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>BloxQuiz</Link>
              <span>/</span>
              <Link href="/stats" style={{ color: "inherit", textDecoration: "none" }}>Stats</Link>
              <span>/</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Trending</span>
            </nav>

            <h1 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.1 }}>
              📈 Trending Roblox Games {new Date().getFullYear()}
            </h1>
            <p style={{ margin: "0 0 28px", fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 600 }}>
              {topGame && topGame.playerDelta > 0
                ? `${topGame.name} is the fastest growing Roblox game right now, gaining ${formatNumber(topGame.playerDelta)} average players day-over-day. Rankings based on daily average player count change.`
                : "Roblox games ranked by day-over-day player count growth. Updated daily."}
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ background: "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)", borderRadius: 12, padding: "16px 24px", minWidth: 160 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Gaining Players</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{gainers.length}</div>
              </div>
              <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 24px", minWidth: 160 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Losing Players</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{losers.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 80px" }}>

          {/* Quick Answer block */}
          <div style={{ background: "linear-gradient(135deg, #0f1629 0%, #111827 100%)", border: "1px solid rgba(0,180,216,0.2)", borderLeft: "3px solid #00b4d8", borderRadius: 12, padding: "20px 24px", marginBottom: 32 }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>
              {games.length > 0
                ? `In ${month}, ${gainers.length} out of ${games.length} tracked Roblox games are gaining players compared to yesterday${topGame && topGame.playerDelta > 0 ? `, with ${topGame.name} leading growth at +${formatNumber(topGame.playerDelta)} average daily players` : ""}. BloxQuiz calculates trending data from hourly snapshots aggregated into daily averages, giving the most accurate view of which games are actually growing.`
                : `BloxQuiz tracks trending Roblox games by comparing daily average player counts day-over-day, using hourly snapshot data.`}
            </p>
          </div>

          {games.length === 0 ? (
            <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "40px 24px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
              <p style={{ margin: 0, fontSize: 15 }}>
                📡 Collecting trend data... Check back after the daily aggregate cron has run for at least 2 days.
              </p>
            </div>
          ) : (
            <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 130px 130px 110px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                <span>#</span>
                <span>Game</span>
                <span style={{ textAlign: "right" }}>Player Change</span>
                <span style={{ textAlign: "right" }}>Playing Now</span>
                <span style={{ textAlign: "right" }}>Growth</span>
              </div>

              {games.map((game, i) => {
                const isGaining = game.playerDelta >= 0;
                return (
                  <Link key={game.slug} href={`/stats/${game.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "52px 1fr 130px 130px 110px", padding: "14px 20px", borderBottom: i < games.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.3)" }}>{i + 1}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {game.thumbnail_url ? (
                          <img src={game.thumbnail_url} alt={game.name} width={40} height={40} style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                            {game.emoji ?? "🎮"}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>
                            {game.emoji && <span style={{ marginRight: 6 }}>{game.emoji}</span>}
                            {game.name}
                          </div>
                          {game.genre && <div style={{ fontSize: 11, color: "rgba(0,180,216,0.8)", textTransform: "capitalize", marginTop: 2 }}>{game.genre}</div>}
                        </div>
                      </div>
                      <span style={{ textAlign: "right", fontSize: 15, fontWeight: 800, color: isGaining ? "#00f5a0" : "#ff3cac", fontVariantNumeric: "tabular-nums" }}>
                        {isGaining ? "+" : ""}{formatNumber(game.playerDelta)}
                      </span>
                      <span style={{ textAlign: "right", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)", fontVariantNumeric: "tabular-nums" }}>
                        {formatNumber(game.current_players)}
                      </span>
                      <span style={{ textAlign: "right", fontSize: 12, fontWeight: 700, color: isGaining ? "#00f5a0" : "#ff3cac" }}>
                        {isGaining ? "▲" : "▼"} {Math.abs(game.growthPct).toFixed(1)}%
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <p style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
            Growth calculated from daily average player counts · Updated daily · Click any game for full charts
          </p>

          <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/stats/most-played" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>🎮 Most Played</Link>
            <Link href="/stats/most-visited" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>👁️ Most Visited</Link>
            <Link href="/stats" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>📊 All Stats</Link>
          </div>
        </div>
      </div>
      <style>{`.stats-row:hover { background: rgba(255,255,255,0.03); }`}</style>
    </>
  );
}