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

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const [slugA, slugB] = parsed;
  const [gameA, gameB] = await Promise.all([getGame(slugA), getGame(slugB)]);
  if (!gameA || !gameB) return {};

  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  return {
    title: `${gameA.name} vs ${gameB.name} — Player Count Comparison (${month}) | BloxQuiz`,
    description: `${gameA.name} has ${formatNumber(gameA.current_players)} players vs ${gameB.name} with ${formatNumber(gameB.current_players)} players. Live side-by-side stats comparison. Updated hourly.`,
    alternates: { canonical: `https://www.bloxquiz.gg/stats/compare/${pair}` },
    openGraph: {
      title: `${gameA.name} vs ${gameB.name} Player Count | BloxQuiz`,
      description: `Live player count comparison: ${gameA.name} vs ${gameB.name}. Updated hourly.`,
      url: `https://www.bloxquiz.gg/stats/compare/${pair}`,
      siteName: "BloxQuiz",
      type: "website",
    },
  };
}

function StatRow({ label, valueA, valueB, higherIsBetter = true }: { label: string; valueA: number | null; valueB: number | null; higherIsBetter?: boolean }) {
  const winner = valueA && valueB
    ? (higherIsBetter ? (valueA > valueB ? "A" : valueA < valueB ? "B" : "tie") : (valueA < valueB ? "A" : valueA > valueB ? "B" : "tie"))
    : "tie";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 1fr", gap: 8, alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ textAlign: "right", fontSize: 18, fontWeight: 800, color: winner === "A" ? "#00b4d8" : "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
        {label === "Total Visits" ? formatVisits(valueA) : formatNumber(valueA)}
        {winner === "A" && <span style={{ marginLeft: 6, fontSize: 12 }}>👑</span>}
      </div>
      <div style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{label}</div>
      <div style={{ textAlign: "left", fontSize: 18, fontWeight: 800, color: winner === "B" ? "#00b4d8" : "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
        {winner === "B" && <span style={{ marginRight: 6, fontSize: 12 }}>👑</span>}
        {label === "Total Visits" ? formatVisits(valueB) : formatNumber(valueB)}
      </div>
    </div>
  );
}

export default async function ComparePage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();
  const [slugA, slugB] = parsed;

  const [gameA, gameB] = await Promise.all([getGame(slugA), getGame(slugB)]);
  if (!gameA || !gameB) notFound();

  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  const approvalA = gameA.likes && gameA.dislikes && gameA.likes + gameA.dislikes > 0
    ? Math.round((gameA.likes / (gameA.likes + gameA.dislikes)) * 100)
    : null;
  const approvalB = gameB.likes && gameB.dislikes && gameB.likes + gameB.dislikes > 0
    ? Math.round((gameB.likes / (gameB.likes + gameB.dislikes)) * 100)
    : null;

  const playerWinner = gameA.current_players && gameB.current_players
    ? (gameA.current_players > gameB.current_players ? gameA : gameB)
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bloxquiz.gg" },
          { "@type": "ListItem", position: 2, name: "Stats", item: "https://www.bloxquiz.gg/stats" },
          { "@type": "ListItem", position: 3, name: "Compare", item: "https://www.bloxquiz.gg/stats/compare" },
          { "@type": "ListItem", position: 4, name: `${gameA.name} vs ${gameB.name}`, item: `https://www.bloxquiz.gg/stats/compare/${pair}` },
        ],
      },
      {
        "@type": "Article",
        headline: `${gameA.name} vs ${gameB.name}: Player Count Comparison — ${month}`,
        dateModified: new Date().toISOString(),
        author: { "@type": "Organization", name: "BloxQuiz" },
        publisher: { "@type": "Organization", name: "BloxQuiz" },
        description: `Live side-by-side comparison of ${gameA.name} and ${gameB.name} player counts, total visits, and popularity stats.`,
        mainEntityOfPage: `https://www.bloxquiz.gg/stats/compare/${pair}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

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
            <p style={{ margin: "0 0 12px", fontSize: 16, color: "rgba(255,255,255,0.55)" }}>
              Player count comparison — {month} · Updated {timeAgo(gameA.last_updated)}
            </p>
            {playerWinner && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.2)", borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 700, color: "#00b4d8" }}>
                👑 {playerWinner.name} is more popular right now with {formatNumber(playerWinner.current_players)} players
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px 80px" }}>
          <div style={{ background: "linear-gradient(135deg, #0f1629 0%, #111827 100%)", border: "1px solid rgba(0,180,216,0.2)", borderLeft: "3px solid #00b4d8", borderRadius: 12, padding: "20px 24px", marginBottom: 32 }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>
              {gameA.name} currently has {formatNumber(gameA.current_players)} active players compared to {gameB.name}'s {formatNumber(gameB.current_players)}.
              {" "}{gameA.name} has {formatVisits(gameA.total_visits)} total all-time visits versus {formatVisits(gameB.total_visits)} for {gameB.name}.
              {playerWinner ? ` ${playerWinner.name} is the more popular game by concurrent player count in ${month}.` : ""}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {[gameA, gameB].map((game) => (
              <Link key={game.slug} href={`/stats/${game.slug}`} style={{ textDecoration: "none" }}>
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

          <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px 28px", marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Head-to-Head Comparison</h2>
            <StatRow label="Playing Now" valueA={gameA.current_players} valueB={gameB.current_players} />
            <StatRow label="Total Visits" valueA={gameA.total_visits} valueB={gameB.total_visits} />
            <StatRow label="Favorites" valueA={gameA.favorites} valueB={gameB.favorites} />
            {(approvalA || approvalB) && <StatRow label="Approval %" valueA={approvalA} valueB={approvalB} />}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 40 }}>
            <Link href={`/stats/${gameA.slug}`} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}><span>📊</span><span>{gameA.name} Full Stats</span></Link>
            <Link href={`/stats/${gameB.slug}`} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}><span>📊</span><span>{gameB.name} Full Stats</span></Link>
            <Link href={`/games/${gameA.slug}`} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}><span>🧠</span><span>{gameA.name} Quizzes</span></Link>
            <Link href={`/games/${gameB.slug}`} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}><span>🧠</span><span>{gameB.name} Quizzes</span></Link>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/stats/most-played" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>🎮 Most Played</Link>
            <Link href="/stats/trending" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>📈 Trending</Link>
            <Link href="/stats" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 20px", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>📊 All Stats</Link>
          </div>

          <p style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
            Stats updated hourly via the Roblox API · Last updated {timeAgo(gameA.last_updated)}
          </p>
        </div>
      </div>
    </>
  );
}
