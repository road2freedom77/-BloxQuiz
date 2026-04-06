import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "../../../lib/supabase";

export const revalidate = 3600;
export const dynamicParams = true;

interface GameRow {
  slug: string;
  name: string;
  emoji: string | null;
  genre: string | null;
  thumbnail_url: string | null;
  current_players: number | null;
  total_visits: number | null;
  favorites: number | null;
  likes: number | null;
  dislikes: number | null;
  last_updated: string | null;
  intro: string | null;
  universe_id: number;
}

interface CompareInsights {
  slug_a: string;
  slug_b: string;
  players_a: number;
  players_b: number;
  players_winner: string;
  player_gap_pct: number;
  visits_a: number;
  visits_b: number;
  visits_winner: string;
  favorites_a: number;
  favorites_b: number;
  favorites_winner: string;
  rank_a: number;
  rank_b: number;
  genre_a: string;
  genre_b: string;
  shared_genre: boolean;
  trend_a: string | null;
  trend_b: string | null;
  trend_pct_a: number | null;
  trend_pct_b: number | null;
  trend_winner_7d: string | null;
  volatility_a: string | null;
  volatility_b: string | null;
  days_tracked_a: number;
  days_tracked_b: number;
  avg_7d_a: number | null;
  avg_7d_b: number | null;
  weekend_lift_a: number | null;
  weekend_lift_b: number | null;
}

function formatNumber(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return Math.round(n / 1_000) + "K";
  return n.toLocaleString();
}

function formatVisits(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  return n.toLocaleString();
}

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return diff + "m ago";
  return Math.floor(diff / 60) + "h ago";
}

function parsePair(pair: string): [string, string] | null {
  const idx = pair.indexOf("-vs-");
  if (idx === -1) return null;
  const slugA = pair.slice(0, idx);
  const slugB = pair.slice(idx + 4);
  if (!slugA || !slugB) return null;
  return [slugA, slugB];
}

async function getGame(slug: string): Promise<GameRow | null> {
  const { data, error } = await supabaseAdmin
    .from("roblox_games")
    .select("slug, name, emoji, genre, thumbnail_url, current_players, total_visits, favorites, likes, dislikes, last_updated, intro, universe_id")
    .eq("slug", slug)
    .eq("is_tracked", true)
    .single();
  if (error || !data) return null;
  return data as GameRow;
}

async function getCompareInsights(slugA: string, slugB: string): Promise<CompareInsights | null> {
  // Ensure alphabetical order for the view
  const [a, b] = [slugA, slugB].sort();
  const { data } = await supabaseAdmin
    .from("compare_page_insights_v1")
    .select("*")
    .eq("slug_a", a)
    .eq("slug_b", b)
    .single();
  return data as CompareInsights | null;
}

function trendColor(label: string | null): string {
  if (label === "Rising") return "#00f5a0";
  if (label === "Cooling Off") return "#ff6b6b";
  return "#a0aec0";
}

function trendArrow(label: string | null): string {
  if (label === "Rising") return "↑";
  if (label === "Cooling Off") return "↓";
  return "→";
}

// Generate best-for labels based on genre and player counts
function getBestFor(gameA: GameRow, gameB: GameRow, insights: CompareInsights | null) {
  const results: { label: string; winner: GameRow; reason: string }[] = [];

  // Beginners: favor roleplay/simulator over shooter/rpg
  const beginnerFriendly = ["roleplay", "simulator", "fashion"];
  const aBeginnerScore = beginnerFriendly.includes(gameA.genre ?? "") ? 1 : 0;
  const bBeginnerScore = beginnerFriendly.includes(gameB.genre ?? "") ? 1 : 0;
  if (aBeginnerScore !== bBeginnerScore) {
    results.push({
      label: "Beginners",
      winner: aBeginnerScore > bBeginnerScore ? gameA : gameB,
      reason: "more casual and accessible genre",
    });
  }

  // Friends: higher player count = more social activity
  if (gameA.current_players && gameB.current_players) {
    results.push({
      label: "Playing with Friends",
      winner: gameA.current_players > gameB.current_players ? gameA : gameB,
      reason: "larger active player base means easier matchmaking",
    });
  }

  // Long sessions: favor rpg/simulator
  const longSession = ["rpg", "simulator", "roleplay"];
  const aLongScore = longSession.includes(gameA.genre ?? "") ? 1 : 0;
  const bLongScore = longSession.includes(gameB.genre ?? "") ? 1 : 0;
  if (aLongScore !== bLongScore) {
    results.push({
      label: "Long Sessions",
      winner: aLongScore > bLongScore ? gameA : gameB,
      reason: "deeper progression systems reward longer play",
    });
  }

  // Quick sessions: favor shooter/horror/obby
  const quickSession = ["shooter", "horror", "obby", "mystery"];
  const aQuickScore = quickSession.includes(gameA.genre ?? "") ? 1 : 0;
  const bQuickScore = quickSession.includes(gameB.genre ?? "") ? 1 : 0;
  if (aQuickScore !== bQuickScore) {
    results.push({
      label: "Quick Sessions",
      winner: aQuickScore > bQuickScore ? gameA : gameB,
      reason: "faster round-based gameplay fits shorter sessions",
    });
  }

  return results;
}

function StatRow({ label, valueA, valueB, formatFn }: {
  label: string;
  valueA: number | null;
  valueB: number | null;
  formatFn?: (n: number | null | undefined) => string;
}) {
  const fmt = formatFn ?? formatNumber;
  const winner = valueA && valueB
    ? (valueA > valueB ? "A" : valueA < valueB ? "B" : "tie")
    : "tie";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 1fr", gap: 8, alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ textAlign: "right", fontSize: 18, fontWeight: 800, color: winner === "A" ? "#00b4d8" : "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
        {fmt(valueA)}
        {winner === "A" && <span style={{ marginLeft: 6, fontSize: 12 }}>{"👑"}</span>}
      </div>
      <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{label}</div>
      <div style={{ textAlign: "left", fontSize: 18, fontWeight: 800, color: winner === "B" ? "#00b4d8" : "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
        {winner === "B" && <span style={{ marginRight: 6, fontSize: 12 }}>{"👑"}</span>}
        {fmt(valueB)}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const [slugA, slugB] = parsed;
  const [gameA, gameB] = await Promise.all([getGame(slugA), getGame(slugB)]);
  if (!gameA || !gameB) return {};

  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const playerWinner = (gameA.current_players ?? 0) > (gameB.current_players ?? 0) ? gameA : gameB;

  return {
    title: `${gameA.name} vs ${gameB.name} — ${formatNumber(gameA.current_players)} vs ${formatNumber(gameB.current_players)} Players (${month}) | BloxQuiz`,
    description: gameA.name + " has " + formatNumber(gameA.current_players) + " players vs " + gameB.name + " with " + formatNumber(gameB.current_players) + ". " + playerWinner.name + " is currently more popular. Live stats updated hourly.",
    alternates: { canonical: "https://www.bloxquiz.gg/stats/compare/" + pair },
    openGraph: {
      title: gameA.name + " vs " + gameB.name + " Player Count | BloxQuiz",
      description: "Live player count comparison: " + gameA.name + " vs " + gameB.name + ". Updated hourly.",
      url: "https://www.bloxquiz.gg/stats/compare/" + pair,
      siteName: "BloxQuiz",
      type: "website",
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();
  const [slugA, slugB] = parsed;

  const [gameA, gameB, insights] = await Promise.all([
    getGame(slugA),
    getGame(slugB),
    getCompareInsights(slugA, slugB),
  ]);
  if (!gameA || !gameB) notFound();

  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const playerWinner = (gameA.current_players ?? 0) >= (gameB.current_players ?? 0) ? gameA : gameB;
  const playerLoser = playerWinner.slug === gameA.slug ? gameB : gameA;
  const hasTrend = insights && insights.days_tracked_a >= 7 && insights.days_tracked_b >= 7;
  const bestForList = getBestFor(gameA, gameB, insights);

  // Trend labels relative to page param order (not alphabetical)
  const trendA = insights ? (insights.slug_a === slugA ? insights.trend_a : insights.trend_b) : null;
  const trendB = insights ? (insights.slug_a === slugA ? insights.trend_b : insights.trend_a) : null;
  const trendPctA = insights ? (insights.slug_a === slugA ? insights.trend_pct_a : insights.trend_pct_b) : null;
  const trendPctB = insights ? (insights.slug_a === slugA ? insights.trend_pct_b : insights.trend_pct_a) : null;
  const avg7dA = insights ? (insights.slug_a === slugA ? insights.avg_7d_a : insights.avg_7d_b) : null;
  const avg7dB = insights ? (insights.slug_a === slugA ? insights.avg_7d_b : insights.avg_7d_a) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bloxquiz.gg" },
          { "@type": "ListItem", position: 2, name: "Stats", item: "https://www.bloxquiz.gg/stats" },
          { "@type": "ListItem", position: 3, name: "Compare", item: "https://www.bloxquiz.gg/stats/compare" },
          { "@type": "ListItem", position: 4, name: gameA.name + " vs " + gameB.name, item: "https://www.bloxquiz.gg/stats/compare/" + pair },
        ],
      },
      {
        "@type": "Article",
        headline: gameA.name + " vs " + gameB.name + ": Player Count Comparison — " + month,
        dateModified: new Date().toISOString(),
        author: { "@type": "Organization", name: "BloxQuiz" },
        publisher: { "@type": "Organization", name: "BloxQuiz" },
        description: "Live side-by-side comparison of " + gameA.name + " and " + gameB.name + " player counts, total visits, trends, and popularity stats.",
        mainEntityOfPage: "https://www.bloxquiz.gg/stats/compare/" + pair,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(180deg, #0f0f23 0%, #0a0a14 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "48px 0 40px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
            <nav style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>BloxQuiz</Link>
              <span>/</span>
              <Link href="/stats" style={{ color: "inherit", textDecoration: "none" }}>Stats</Link>
              <span>/</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{gameA.name} vs {gameB.name}</span>
            </nav>

            <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.1 }}>
              {gameA.emoji} {gameA.name} vs {gameB.emoji} {gameB.name}
            </h1>
            <p style={{ margin: "0 0 16px", fontSize: 16, color: "rgba(255,255,255,0.55)" }}>
              Player count comparison — {month} · Updated {timeAgo(gameA.last_updated)}
            </p>

            {/* Winner badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.2)", borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 700, color: "#00b4d8" }}>
              {"👑 "}{playerWinner.name} is more popular right now with {formatNumber(playerWinner.current_players)} players
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px 80px" }}>

          {/* Quick verdict */}
          <div style={{ background: "linear-gradient(135deg, #0f1629 0%, #111827 100%)", border: "1px solid rgba(0,180,216,0.2)", borderLeft: "3px solid #00b4d8", borderRadius: 12, padding: "20px 24px", marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>Quick Verdict</div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>
              {playerWinner.name} currently leads with {formatNumber(playerWinner.current_players)} active players vs {formatNumber(playerLoser.current_players)} for {playerLoser.name} — a {Math.abs(insights?.player_gap_pct ?? 0)}% gap.
              {" "}{playerWinner.name} also has more all-time visits at {formatVisits(playerWinner.total_visits)} vs {formatVisits(playerLoser.total_visits)}.
              {hasTrend && insights?.trend_winner_7d
                ? " Over the past 7 days, " + (insights.trend_winner_7d === gameA.slug ? gameA.name : gameB.name) + " has the stronger momentum."
                : ""}
              {gameA.genre && gameB.genre && gameA.genre !== gameB.genre
                ? " " + gameA.name + " is a " + gameA.genre + " game while " + gameB.name + " is " + gameB.genre + " — different experiences for different playstyles."
                : ""}
            </p>
          </div>

          {/* Game cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {[gameA, gameB].map((game) => (
              <Link key={game.slug} href={"/stats/" + game.slug} style={{ textDecoration: "none" }}>
                <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px", textAlign: "center" }}>
                  {game.thumbnail_url && (
                    <img src={game.thumbnail_url} alt={game.name} width={64} height={64} style={{ borderRadius: 12, objectFit: "cover", marginBottom: 12 }} />
                  )}
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{game.emoji} {game.name}</div>
                  {game.genre && <div style={{ fontSize: 11, color: "#00b4d8", textTransform: "capitalize", marginBottom: 8 }}>{game.genre}</div>}
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#00b4d8", fontVariantNumeric: "tabular-nums" }}>{formatNumber(game.current_players)}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>playing now</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>View Full Stats →</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Head-to-head table */}
          <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px 28px", marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Head-to-Head</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
              {insights ? ("Rank #" + (insights.slug_a === slugA ? insights.rank_a : insights.rank_b) + " vs Rank #" + (insights.slug_a === slugA ? insights.rank_b : insights.rank_a) + " by concurrent players") : "Live stats comparison"}
            </p>
            <StatRow label="Playing Now" valueA={gameA.current_players} valueB={gameB.current_players} />
            <StatRow label="Total Visits" valueA={gameA.total_visits} valueB={gameB.total_visits} formatFn={formatVisits} />
            <StatRow label="Favorites" valueA={gameA.favorites} valueB={gameB.favorites} />
            {hasTrend && (
              <StatRow label="7-Day Avg" valueA={avg7dA} valueB={avg7dB} />
            )}
          </div>

          {/* Trend snapshot — only if 7+ days of data */}
          {hasTrend && (
            <div style={{ background: "#0f1629", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "24px 28px", marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 20 }}>7-Day Momentum</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[{ game: gameA, trend: trendA, pct: trendPctA }, { game: gameB, trend: trendB, pct: trendPctB }].map(({ game, trend, pct }) => (
                  <div key={game.slug} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{game.emoji} {game.name}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: trendColor(trend) }}>
                      {trendArrow(trend)} {trend ?? "—"}
                    </div>
                    {pct !== null && (
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                        {pct > 0 ? "+" : ""}{pct}% vs prior 3 days
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {insights?.trend_winner_7d && (
                <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(0,245,160,0.05)", border: "1px solid rgba(0,245,160,0.15)", borderRadius: 10, fontSize: 13, color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
                  {"📈 "}{insights.trend_winner_7d === gameA.slug ? gameA.name : gameB.name} has stronger momentum this week
                </div>
              )}
            </div>
          )}

          {/* Best for */}
          {bestForList.length > 0 && (
            <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px 28px", marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Best For...</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                {bestForList.map(({ label, winner, reason }) => (
                  <div key={label} style={{ background: "#0f1629", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#00b4d8", marginBottom: 4 }}>{winner.emoji} {winner.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cross-links — full set */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
            <Link href={"/stats/" + gameA.slug} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              <span>{"📊"}</span><span>{gameA.name} Stats</span>
            </Link>
            <Link href={"/stats/" + gameB.slug} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              <span>{"📊"}</span><span>{gameB.name} Stats</span>
            </Link>
            <Link href={"/stats/" + gameA.slug + "/history"} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              <span>{"📈"}</span><span>{gameA.name} History</span>
            </Link>
            <Link href={"/stats/" + gameB.slug + "/history"} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              <span>{"📈"}</span><span>{gameB.name} History</span>
            </Link>
            <Link href={"/games/" + gameA.slug} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              <span>{"🧠"}</span><span>{gameA.name} Quizzes</span>
            </Link>
            <Link href={"/games/" + gameB.slug} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              <span>{"🧠"}</span><span>{gameB.name} Quizzes</span>
            </Link>
            <Link href={"/codes/" + gameA.slug} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              <span>{"🎁"}</span><span>{gameA.name} Codes</span>
            </Link>
            <Link href={"/codes/" + gameB.slug} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              <span>{"🎁"}</span><span>{gameB.name} Codes</span>
            </Link>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/stats/most-played" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>{"🎮 Most Played"}</Link>
            <Link href="/stats/trending" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>{"📈 Trending"}</Link>
            <Link href="/stats" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>{"📊 All Stats"}</Link>
          </div>

          <p style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
            Stats updated hourly via the Roblox API · Last updated {timeAgo(gameA.last_updated)}
          </p>
        </div>
      </div>
    </>
  );
}