import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "../../../lib/supabase";

export const revalidate = 3600;
export const dynamicParams = false;

const GENRES: Record<string, { label: string; emoji: string; description: string }> = {
  roleplay:        { label: "Roleplay", emoji: "🏠", description: "The most popular Roblox roleplay games ranked by live player count. Social, open-world, and life-sim experiences." },
  simulator:       { label: "Simulator", emoji: "🌱", description: "Top Roblox simulator games by concurrent players. Farming, collecting, and progression-based experiences." },
  rpg:             { label: "RPG", emoji: "⚔️", description: "The most played Roblox RPG games right now. Adventure, combat, and character progression games." },
  horror:          { label: "Horror", emoji: "👻", description: "Most popular Roblox horror games ranked by player count. Survival, entity, and scary experiences." },
  obby:            { label: "Obby", emoji: "🏗️", description: "Top Roblox obby games by concurrent players. Obstacle courses, parkour, and platformer challenges." },
  shooter:         { label: "Shooter", emoji: "🔫", description: "Most played Roblox shooter games right now. FPS, team-based, and competitive combat experiences." },
  fashion:         { label: "Fashion", emoji: "👗", description: "Top Roblox fashion games by player count. Dress-up, styling, and creative expression experiences." },
  mystery:         { label: "Mystery", emoji: "🔪", description: "Most popular Roblox mystery games ranked by live players. Social deduction and hidden role experiences." },
  rhythm:          { label: "Rhythm", emoji: "🎵", description: "Top Roblox rhythm games by concurrent players. Music, timing, and beat-based gameplay experiences." },
  sports:          { label: "Sports", emoji: "⚽", description: "Most played Roblox sports games right now. Football, competitive, and athletic gameplay experiences." },
  survival:        { label: "Survival", emoji: "🌪️", description: "Top Roblox survival games by player count. Disaster, escape, and endurance-based experiences." },
  "tower-defense": { label: "Tower Defense", emoji: "🛡️", description: "Most popular Roblox tower defense games ranked by live player count. Strategic unit placement and wave defense." },
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

async function getGamesByGenre(genre: string): Promise<GameRow[]> {
  const { data } = await supabaseAdmin
    .from("roblox_games")
    .select("slug, name, emoji, genre, thumbnail_url, current_players, total_visits, last_updated")
    .eq("is_tracked", true)
    .eq("genre", genre)
    .order("current_players", { ascending: false, nullsFirst: false });
  return (data as GameRow[]) ?? [];
}

export async function generateStaticParams() {
  return Object.keys(GENRES).map((genre) => ({ genre }));
}

export async function generateMetadata({ params }: { params: Promise<{ genre: string }> }) {
  const { genre } = await params;
  const info = GENRES[genre];
  if (!info) return {};
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  return {
    title: `Best Roblox ${info.label} Games ${month} — Live Player Rankings | BloxQuiz`,
    description: `Top Roblox ${info.label.toLowerCase()} games ranked by live concurrent players in ${month}. ${info.description}`,
    alternates: { canonical: `https://www.bloxquiz.gg/stats/category/${genre}` },
    openGraph: {
      title: `Best Roblox ${info.label} Games ${month} — Live Rankings | BloxQuiz`,
      description: info.description,
      url: `https://www.bloxquiz.gg/stats/category/${genre}`,
      siteName: "BloxQuiz",
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ genre: string }> }) {
  const { genre } = await params;
  const info = GENRES[genre];
  if (!info) notFound();

  const games = await getGamesByGenre(genre);
  const topGame = games[0];
  const totalPlayers = games.reduce((sum, g) => sum + (g.current_players ?? 0), 0);
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const otherGenres = Object.entries(GENRES).filter(([g]) => g !== genre);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bloxquiz.gg" },
          { "@type": "ListItem", position: 2, name: "Stats", item: "https://www.bloxquiz.gg/stats" },
          { "@type": "ListItem", position: 3, name: `${info.label} Games`, item: `https://www.bloxquiz.gg/stats/category/${genre}` },
        ],
      },
      {
        "@type": "Article",
        headline: `Best Roblox ${info.label} Games — ${month}`,
        dateModified: new Date().toISOString(),
        author: { "@type": "Organization", name: "BloxQuiz" },
        publisher: { "@type": "Organization", name: "BloxQuiz" },
        description: info.description,
        mainEntityOfPage: `https://www.bloxquiz.gg/stats/category/${genre}`,
      },
      {
        "@type": "ItemList",
        name: `Top Roblox ${info.label} Games — ${month}`,
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
            <nav style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>BloxQuiz</Link>
              <span>/</span>
              <Link href="/stats" style={{ color: "inherit", textDecoration: "none" }}>Stats</Link>
              <span>/</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{info.label} Games</span>
            </nav>

            <h1 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.1 }}>
              {info.emoji} Best Roblox {info.label} Games {month}
            </h1>
            <p style={{ margin: "0 0 28px", fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 600 }}>
              {topGame
                ? `${topGame.name} is the most popular Roblox ${info.label.toLowerCase()} game right now with ${formatNumber(topGame.current_players)} concurrent players. Rankings updated hourly.`
                : info.description}
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {totalPlayers > 0 && (
                <div style={{ background: "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)", borderRadius: 12, padding: "16px 24px", minWidth: 160 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Total {info.label} Players</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{formatNumber(totalPlayers)}</div>
                </div>
              )}
              <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 24px", minWidth: 160 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Games Tracked</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{games.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 80px" }}>

          {/* Quick Answer block */}
          <div style={{ background: "linear-gradient(135deg, #0f1629 0%, #111827 100%)", border: "1px solid rgba(0,180,216,0.2)", borderLeft: "3px solid #00b4d8", borderRadius: 12, padding: "20px 24px", marginBottom: 32 }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>
              {games.length > 0
                ? `The best Roblox ${info.label.toLowerCase()} game in ${month} is ${topGame?.name} with ${formatNumber(topGame?.current_players)} active players. There are ${games.length} tracked Roblox ${info.label.toLowerCase()} games with a combined ${formatNumber(totalPlayers)} concurrent players right now. BloxQuiz updates these rankings every hour via the Roblox API.`
                : `BloxQuiz tracks the most popular Roblox ${info.label.toLowerCase()} games, with player counts updated hourly via the Roblox API.`}
            </p>
          </div>

          {games.length === 0 ? (
            <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "40px 24px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
              <p style={{ margin: 0, fontSize: 15 }}>No {info.label.toLowerCase()} games tracked yet. Check back soon.</p>
            </div>
          ) : (
            <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", marginBottom: 40 }}>
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
                        <div style={{ fontSize: 11, color: "rgba(0,180,216,0.8)", textTransform: "capitalize", marginTop: 2 }}>{info.label}</div>
                      </div>
                    </div>
                    <span style={{ textAlign: "right", fontSize: 15, fontWeight: 800, color: "#00b4d8", fontVariantNumeric: "tabular-nums" }}>{formatNumber(game.current_players)}</span>
                    <span style={{ textAlign: "right", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)", fontVariantNumeric: "tabular-nums" }}>{formatVisits(game.total_visits)}</span>
                    <span style={{ textAlign: "right", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{timeAgo(game.last_updated)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Browse other genres */}
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Browse Other Genres</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginBottom: 40 }}>
            {otherGenres.map(([g, gInfo]) => (
              <Link key={g} href={`/stats/category/${g}`} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 16px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 13 }} className="stats-row">
                <span style={{ fontSize: 18 }}>{gInfo.emoji}</span>
                <span>{gInfo.label}</span>
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/stats/most-played" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>🎮 Most Played</Link>
            <Link href="/stats/trending" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>📈 Trending</Link>
            <Link href="/stats" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>📊 All Stats</Link>
          </div>

          <p style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
            Player counts fetched hourly from the Roblox API · Click any game for full stats &amp; charts
          </p>
        </div>
      </div>
      <style>{`.stats-row:hover { background: rgba(255,255,255,0.03); }`}</style>
    </>
  );
}
