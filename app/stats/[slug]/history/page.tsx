import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "../../../lib/supabase";
import StatsHistoryClient from "./StatsHistoryClient";

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
  last_updated: string | null;
  universe_id: number;
}

interface DailyStatRow {
  date: string;
  avg_players: number;
  peak_players: number;
  min_players: number;
  total_visits_delta: number;
}

async function getGame(slug: string): Promise<GameRow | null> {
  const { data, error } = await supabaseAdmin
    .from("roblox_games")
    .select("slug, name, emoji, genre, thumbnail_url, current_players, total_visits, last_updated, universe_id")
    .eq("slug", slug)
    .eq("is_tracked", true)
    .single();
  if (error || !data) return null;
  return data as GameRow;
}

async function getDailyStats(universeId: number): Promise<DailyStatRow[]> {
  const { data } = await supabaseAdmin
    .from("game_daily_stats")
    .select("date, avg_players, peak_players, min_players, total_visits_delta")
    .eq("universe_id", universeId)
    .order("date", { ascending: false })
    .limit(90); // 90 days of history
  return (data as DailyStatRow[]) ?? [];
}

async function getAllSlugs(): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from("roblox_games")
    .select("slug")
    .eq("is_tracked", true);
  return (data ?? []).map((g: { slug: string }) => g.slug);
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) return {};

  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  return {
    title: `${game.name} Player Count History (${month}) — 90 Day Chart | BloxQuiz`,
    description: `${game.name} player count history over the last 90 days. Daily average, peak, and minimum player counts with visit growth data. Updated daily.`,
    alternates: { canonical: `https://www.bloxquiz.gg/stats/${slug}/history` },
    openGraph: {
      title: `${game.name} Player Count History | BloxQuiz`,
      description: `90-day player count history for ${game.name}. Daily averages, peaks, and visit growth.`,
      url: `https://www.bloxquiz.gg/stats/${slug}/history`,
      siteName: "BloxQuiz",
      type: "website",
      ...(game.thumbnail_url ? { images: [{ url: game.thumbnail_url }] } : {}),
    },
  };
}

export default async function StatsHistoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();

  const dailyStats = await getDailyStats(game.universe_id);
  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  const peakDay = dailyStats.length
    ? dailyStats.reduce((max, d) => d.peak_players > max.peak_players ? d : max, dailyStats[0])
    : null;

  const avgOverPeriod = dailyStats.length
    ? Math.round(dailyStats.reduce((sum, d) => sum + d.avg_players, 0) / dailyStats.length)
    : null;

  const totalVisitsGained = dailyStats.reduce((sum, d) => sum + (d.total_visits_delta ?? 0), 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bloxquiz.gg" },
          { "@type": "ListItem", position: 2, name: "Stats", item: "https://www.bloxquiz.gg/stats" },
          { "@type": "ListItem", position: 3, name: `${game.name} Stats`, item: `https://www.bloxquiz.gg/stats/${slug}` },
          { "@type": "ListItem", position: 4, name: "Player Count History", item: `https://www.bloxquiz.gg/stats/${slug}/history` },
        ],
      },
      {
        "@type": "Article",
        headline: `${game.name} Player Count History — ${month}`,
        dateModified: game.last_updated ?? new Date().toISOString(),
        author: { "@type": "Organization", name: "BloxQuiz" },
        publisher: { "@type": "Organization", name: "BloxQuiz" },
        description: `Historical player count data for ${game.name} including daily averages, peaks, and visit growth over the past 90 days.`,
        mainEntityOfPage: `https://www.bloxquiz.gg/stats/${slug}/history`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(180deg, #0f0f23 0%, #0a0a14 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "48px 0 36px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
            <nav style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>BloxQuiz</Link>
              <span>/</span>
              <Link href="/stats" style={{ color: "inherit", textDecoration: "none" }}>Stats</Link>
              <span>/</span>
              <Link href={`/stats/${slug}`} style={{ color: "inherit", textDecoration: "none" }}>{game.name}</Link>
              <span>/</span>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>History</span>
            </nav>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
              {game.thumbnail_url && (
                <div style={{ width: 64, height: 64, borderRadius: 12, overflow: "hidden", flexShrink: 0, border: "2px solid rgba(255,255,255,0.1)" }}>
                  <img src={game.thumbnail_url} alt={game.name} width={64} height={64} style={{ objectFit: "cover" }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: 30, fontWeight: 900, margin: "0 0 6px", lineHeight: 1.1 }}>
                  {game.emoji && <span style={{ marginRight: 8 }}>{game.emoji}</span>}
                  {game.name} Player Count History
                </h1>
                <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                  Daily averages, peaks, and visit growth · Last {dailyStats.length} days of data
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 80px" }}>

          {/* Quick Answer block */}
          <div style={{ background: "linear-gradient(135deg, #0f1629 0%, #111827 100%)", border: "1px solid rgba(0,180,216,0.2)", borderLeft: "3px solid #00b4d8", borderRadius: 12, padding: "20px 24px", marginBottom: 32 }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>
              {dailyStats.length > 0
                ? `${game.name} has averaged ${avgOverPeriod?.toLocaleString() ?? "—"} concurrent players per day over the past ${dailyStats.length} days${peakDay ? `, with a peak of ${peakDay.peak_players.toLocaleString()} players on ${new Date(peakDay.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}` : ""}. The game gained ${totalVisitsGained.toLocaleString()} total visits during this period. BloxQuiz collects hourly snapshots and aggregates them into daily stats.`
                : `BloxQuiz tracks ${game.name} player counts hourly. Daily aggregate data will appear here after the first full day of tracking.`}
            </p>
          </div>

          {/* Summary stat cards */}
          {dailyStats.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 32 }}>
              <div style={{ background: "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)", borderRadius: 14, padding: "20px 24px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Avg Daily Players</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{avgOverPeriod?.toLocaleString() ?? "—"}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>over {dailyStats.length} days</div>
              </div>
              {peakDay && (
                <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>All-Time Peak</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{peakDay.peak_players.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{new Date(peakDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
              )}
              <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Visits Gained</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{totalVisitsGained >= 1_000_000 ? `${(totalVisitsGained / 1_000_000).toFixed(1)}M` : totalVisitsGained >= 1_000 ? `${Math.round(totalVisitsGained / 1_000)}K` : totalVisitsGained.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>last {dailyStats.length} days</div>
              </div>
              <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Days Tracked</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{dailyStats.length}</div>
              </div>
            </div>
          )}

          {/* Charts */}
          <StatsHistoryClient dailyStats={dailyStats} gameName={game.name} />

          {/* Daily data table */}
          {dailyStats.length > 0 && (
            <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", marginTop: 32 }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>Daily Breakdown</h2>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Date", "Avg Players", "Peak Players", "Min Players", "Visits Gained"].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "right", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dailyStats.map((d, i) => (
                      <tr key={d.date} style={{ borderBottom: i < dailyStats.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <td style={{ padding: "10px 16px", textAlign: "right", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
                          {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 700, color: "#00b4d8", fontVariantNumeric: "tabular-nums" }}>{d.avg_players.toLocaleString()}</td>
                        <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "rgba(255,255,255,0.7)", fontVariantNumeric: "tabular-nums" }}>{d.peak_players.toLocaleString()}</td>
                        <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>{d.min_players.toLocaleString()}</td>
                        <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
                          {d.total_visits_delta >= 1_000_000 ? `${(d.total_visits_delta / 1_000_000).toFixed(1)}M` : d.total_visits_delta >= 1_000 ? `${Math.round(d.total_visits_delta / 1_000)}K` : d.total_visits_delta.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cross-links */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginTop: 40 }}>
            <Link href={`/stats/${slug}`} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              <span>📊</span><span>{game.name} Live Stats</span>
            </Link>
            <Link href={`/games/${slug}`} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              <span>🧠</span><span>{game.name} Quizzes</span>
            </Link>
            <Link href={`/codes/${slug}`} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              <span>🎁</span><span>{game.name} Codes</span>
            </Link>
            <Link href="/stats" style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              <span>📈</span><span>All Game Stats</span>
            </Link>
          </div>

          <p style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
            Data collected hourly via the Roblox API and aggregated into daily stats · BloxQuiz.gg
          </p>
        </div>
      </div>
    </>
  );
}