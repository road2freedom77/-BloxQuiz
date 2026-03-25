import Link from "next/link";
import { supabaseAdmin } from "../../lib/supabase";

export const revalidate = 3600;

interface GameRow {
  slug: string;
  name: string;
  emoji: string | null;
  genre: string | null;
  thumbnail_url: string | null;
  current_players: number | null;
  total_visits: number | null;
  favorites: number | null;
  last_updated: string | null;
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
  return n.toLocaleString();
}

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

async function getGames(): Promise<GameRow[]> {
  const { data } = await supabaseAdmin
    .from("roblox_games")
    .select("slug, name, emoji, genre, thumbnail_url, current_players, total_visits, favorites, last_updated")
    .eq("is_tracked", true)
    .order("current_players", { ascending: false, nullsFirst: false });
  return (data as GameRow[]) ?? [];
}

export async function generateMetadata() {
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  const { data: topGame } = await supabaseAdmin
    .from("roblox_games")
    .select("name, current_players")
    .eq("is_tracked", true)
    .order("current_players", { ascending: false, nullsFirst: false })
    .limit(1)
    .single();

  const topName = topGame?.name ?? "Adopt Me!";
  const topCount = topGame?.current_players
    ? topGame.current_players >= 1_000_000
      ? `${(topGame.current_players / 1_000_000).toFixed(1)}M`
      : `${Math.round(topGame.current_players / 1_000)}K`
    : "500K+";

  const title = `Most Played Roblox Games (${month}) — #1 is ${topName} with ${topCount} Players | BloxQuiz`;
  const description = `The most played Roblox games right now ranked by live concurrent players in ${month}. ${topName} leads with ${topCount} active players. Updated hourly with real player counts.`;

  return {
    title,
    description,
    alternates: { canonical: "https://www.bloxquiz.gg/stats/most-played" },
    openGraph: {
      title,
      description,
      url: "https://www.bloxquiz.gg/stats/most-played",
      siteName: "BloxQuiz",
      type: "website",
    },
  };
}

export default async function MostPlayedPage() {
  const games = await getGames();
  const topGame = games[0];
  const totalPlayers = games.reduce((sum, g) => sum + (g.current_players ?? 0), 0);
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bloxquiz.gg" },
          { "@type": "ListItem", position: 2, name: "Stats", item: "https://www.bloxquiz.gg/stats" },
          { "@type": "ListItem", position: 3, name: "Most Played", item: "https://www.bloxquiz.gg/stats/most-played" },
        ],
      },
      {
        "@type": "Article",
        headline: `Most Played Roblox Games — ${month}`,
        dateModified: new Date().toISOString(),
        author: { "@type": "Organization", name: "BloxQuiz" },
        publisher: { "@type": "Organization", name: "BloxQuiz" },
        description: "Live ranking of the most played Roblox games by concurrent player count, updated hourly.",
        mainEntityOfPage: "https://www.bloxquiz.gg/stats/most-played",
      },
      {
        "@type": "ItemList",
        name: `Most Played Roblox Games — ${month}`,
        itemListElement: games.slice(0, 10).map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: g.name,
          url: `https://www.bloxquiz.gg/stats/${g.slug}`,
        })),
      },
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
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Most Played</span>
            </nav>

            <h1 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.1 }}>
              🎮 Most Played Roblox Games {month}
            </h1>
            <p style={{ margin: "0 0 28px", fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 600 }}>
              {topGame
                ? `${topGame.name} is the most played Roblox game right now with ${formatNumber(topGame.current_players)} concurrent players. Rankings updated hourly via the Roblox API.`
                : `Live rankings of the most popular Roblox games by concurrent player count. Updated hourly.`}
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ background: "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)", borderRadius: 12, padding: "16px 24px", minWidth: 160 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Total Playing Now</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{formatNumber(totalPlayers)}</div>
              </div>
              <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 24px", minWidth: 160 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Games Ranked</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{games.length}</div>
              </div>
              <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 24px", minWidth: 160 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>#1 Right Now</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#FFD700" }}>{topGame ? `${topGame.emoji ?? ""} ${topGame.name}` : "—"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rankings */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 80px" }}>

          {/* Quick Answer block */}
          <div style={{ background: "linear-gradient(135deg, #0f1629 0%, #111827 100%)", border: "1px solid rgba(0,180,216,0.2)", borderLeft: "3px solid #00b4d8", borderRadius: 12, padding: "20px 24px", marginBottom: 32 }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>
              {topGame
                ? `The most played Roblox game in ${month} is ${topGame.name} with ${formatNumber(topGame.current_players)} active players. Across all tracked games, Roblox has ${formatNumber(totalPlayers)} concurrent players right now. BloxQuiz tracks player counts hourly so this data is never more than 60 minutes old.`
                : `BloxQuiz tracks live player counts for the most popular Roblox games, updated every hour via the Roblox API.`}
            </p>
          </div>

          <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 140px 140px 120px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
              <span>#</span>
              <span>Game</span>
              <span style={{ textAlign: "right" }}>Playing Now</span>
              <span style={{ textAlign: "right" }}>Total Visits</span>
              <span style={{ textAlign: "right" }}>Updated</span>
            </div>

            {games.map((game, i) => (
              <Link key={game.slug} href={`/stats/${game.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "52px 1fr 140px 140px 120px", padding: "14px 20px", borderBottom: i < games.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                  <span style={{ fontSize: i < 3 ? 18 : 13, fontWeight: 800, color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "rgba(255,255,255,0.3)" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                  </span>
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
                  <span style={{ textAlign: "right", fontSize: 15, fontWeight: 800, color: "#00b4d8", fontVariantNumeric: "tabular-nums" }}>{formatNumber(game.current_players)}</span>
                  <span style={{ textAlign: "right", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)", fontVariantNumeric: "tabular-nums" }}>{formatVisits(game.total_visits)}</span>
                  <span style={{ textAlign: "right", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{timeAgo(game.last_updated)}</span>
                </div>
              </Link>
            ))}
          </div>

          <p style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
            Player counts fetched hourly from the Roblox API · Click any game for full stats &amp; historical charts
          </p>

          <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/stats/most-visited" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>👁️ Most Visited Games</Link>
            <Link href="/stats/trending" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>📈 Trending Games</Link>
            <Link href="/stats" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>📊 All Stats</Link>
          </div>
        </div>
      </div>
      <style>{`.stats-row:hover { background: rgba(255,255,255,0.03); }`}</style>
    </>
  );
}