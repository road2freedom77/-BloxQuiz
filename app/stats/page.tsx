import Link from "next/link";
import { supabaseAdmin } from "../lib/supabase";

export const revalidate = 3600;

export const metadata = {
  title: "Roblox Game Stats — Live Player Counts & Rankings | BloxQuiz",
  description:
    "Live Roblox game player counts, rankings, and stats updated hourly. See the most played Roblox games right now with historical charts and trend data.",
  alternates: { canonical: "https://www.bloxquiz.gg/stats" },
  openGraph: {
    title: "Roblox Game Stats — Live Player Counts & Rankings | BloxQuiz",
    description: "Live Roblox game player counts, rankings, and stats updated hourly.",
    url: "https://www.bloxquiz.gg/stats",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bloxquiz.gg" },
        { "@type": "ListItem", position: 2, name: "Stats", item: "https://www.bloxquiz.gg/stats" },
      ],
    },
    {
      "@type": "Article",
      headline: "Most Played Roblox Games — Live Player Count Rankings",
      dateModified: new Date().toISOString(),
      author: { "@type": "Organization", name: "BloxQuiz" },
      publisher: { "@type": "Organization", name: "BloxQuiz" },
      description: "Live Roblox game player counts and rankings updated hourly.",
      mainEntityOfPage: "https://www.bloxquiz.gg/stats",
    },
  ],
};

export default async function StatsHubPage() {
  const games = await getGames();
  const totalPlayers = games.reduce((sum, g) => sum + (g.current_players ?? 0), 0);

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
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Stats</span>
            </nav>

            <h1 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.1 }}>
              📊 Roblox Game Stats
            </h1>
            <p style={{ margin: "0 0 28px", fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 560 }}>
              Live player counts and rankings for the most popular Roblox games. Updated every hour via the Roblox API.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ background: "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)", borderRadius: 12, padding: "16px 24px", minWidth: 160 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Total Playing Now</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{formatNumber(totalPlayers)}</div>
              </div>
              <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 24px", minWidth: 160 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Games Tracked</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{games.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 80px" }}>

          {/* Explore Stats nav cards */}
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Explore Stats</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 40 }}>
            {[
              { href: "/stats/most-played", emoji: "🎮", label: "Most Played", sub: "By concurrent players" },
              { href: "/stats/most-visited", emoji: "👁️", label: "Most Visited", sub: "By all-time visits" },
              { href: "/stats/trending", emoji: "📈", label: "Trending", sub: "Fastest growing games" },
            ].map(({ href, emoji, label, sub }) => (
              <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 14, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", textDecoration: "none", color: "#fff" }} className="stats-row">
                <span style={{ fontSize: 28 }}>{emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{sub}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Rankings table */}
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Live Rankings</h2>
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
            Player counts fetched hourly from the Roblox API · Click any game for full stats &amp; charts
          </p>
        </div>
      </div>

      <style>{`.stats-row:hover { background: rgba(255,255,255,0.03); }`}</style>
    </>
  );
}