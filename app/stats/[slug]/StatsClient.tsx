"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { GameRow, SnapshotRow, DailyStatRow } from "./page";
import QuizCTA from "../../components/QuizCTA";
import FollowButton from "../../components/FollowButton";
import RobuxCTA from "../../components/RobuxCTA";

interface StatsClientProps {
  game: GameRow;
  snapshots: SnapshotRow[];
  dailyStats: DailyStatRow[];
  rank: number | null;
  approvalRate: string | null;
  peak24h: number | null;
  slug: string;
  quizCount: number;
  compareGames: { slug: string; name: string; emoji: string | null; current_players: number | null }[];
  allFaqs: { q: string; a: string }[];
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
  if (!iso) return "unknown";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

function formatHour(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    month: "short",
    day: "numeric",
  });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function compareUrl(slugA: string, slugB: string): string {
  const [a, b] = [slugA, slugB].sort();
  return `/stats/compare/${a}-vs-${b}`;
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div style={{ background: accent ? "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)" : "var(--card-bg, #1a1a2e)", border: accent ? "none" : "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: accent ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)" }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      {sub && <span style={{ fontSize: 12, color: accent ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }}>{sub}</span>}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
      {children}
    </h2>
  );
}

const customTooltipStyle = {
  background: "#0d0d1a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#fff",
  fontSize: 13,
};

function buildEditorialAnalysis(
  game: GameRow,
  snapshots: SnapshotRow[],
  dailyStats: DailyStatRow[],
  rank: number | null,
  peak24h: number | null,
): string {
  const current = game.current_players;
  const name = game.name;

  if (!current) return "";

  const paragraphs: string[] = [];

  // 1. Current status
  const rankText = rank ? ` ranking #${rank} among all tracked Roblox games` : "";
  const peakGap = peak24h && current ? Math.round(((peak24h - current) / peak24h) * 100) : null;
  const peakText = peakGap && peakGap > 10
    ? ` The 24-hour peak was ${formatNumber(peak24h)}, so the game is currently at ${100 - peakGap}% of its recent high.`
    : peakGap !== null && peakGap <= 10
    ? ` The 24-hour peak was ${formatNumber(peak24h)}, so the game is running close to its recent high.`
    : "";

  paragraphs.push(
    `${name} currently has ${formatNumber(current)} concurrent players${rankText}.${peakText}`
  );

  // 2. Hourly trend — what the data shows, no cause speculation
  if (snapshots.length >= 6) {
    const recent = snapshots.slice(0, 3).map(s => s.concurrent_players);
    const older = snapshots.slice(3, 6).map(s => s.concurrent_players);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    const changePct = Math.round(((recentAvg - olderAvg) / olderAvg) * 100);

    if (Math.abs(changePct) >= 5) {
      const direction = changePct > 0 ? "up" : "down";
      const strength = Math.abs(changePct) > 20 ? "significantly" : Math.abs(changePct) > 10 ? "notably" : "slightly";
      paragraphs.push(
        `Over the last few hours, player counts have moved ${direction} ${strength} — ${Math.abs(changePct)}% compared to earlier readings. Check the hourly chart above for the full picture.`
      );
    } else {
      paragraphs.push(
        `Player counts have been stable over the past several hours, varying less than 5% from the current level.`
      );
    }
  }

  // 3. Week-over-week — data only, no cause claims
  if (dailyStats.length >= 14) {
    const lastWeek = dailyStats.slice(0, 7);
    const prevWeek = dailyStats.slice(7, 14);
    const lastAvg = lastWeek.reduce((a, b) => a + b.avg_players, 0) / lastWeek.length;
    const prevAvg = prevWeek.reduce((a, b) => a + b.avg_players, 0) / prevWeek.length;
    const weekChange = Math.round(((lastAvg - prevAvg) / prevAvg) * 100);

    if (weekChange > 5) {
      paragraphs.push(
        `The 7-day average is up ${weekChange}% compared to the prior week. The 30-day chart shows when this increase began.`
      );
    } else if (weekChange < -5) {
      paragraphs.push(
        `The 7-day average is down ${Math.abs(weekChange)}% compared to the prior week. The 30-day chart shows the full trend.`
      );
    } else {
      paragraphs.push(
        `The 7-day average is within 5% of the prior week, indicating a stable player count over the past month.`
      );
    }
  }

  // 4. Server status — factual only
  const isGoodTime = peakGap !== null && peakGap <= 15;

  if (rank && rank <= 10 && isGoodTime) {
    paragraphs.push(
      `With ${formatNumber(current)} active players and a top-10 ranking, ${name} has full servers right now.`
    );
  } else if (current && current > 10000) {
    paragraphs.push(
      `With ${formatNumber(current)} concurrent players, ${name} has populated servers at this time.`
    );
  } else {
    paragraphs.push(
      `${name} has an active community. Server population is sufficient for normal gameplay at this time.`
    );
  }

  return paragraphs.join("\n\n");
}

export default function StatsClient({ game, snapshots, dailyStats, rank, approvalRate, peak24h, slug, quizCount, compareGames, allFaqs }: StatsClientProps) {
  const hourlyData = useMemo(() => [...snapshots].reverse().map((s) => ({ time: formatHour(s.captured_at), players: s.concurrent_players })), [snapshots]);
  const dailyData = useMemo(() => [...dailyStats].reverse().map((d) => ({ date: formatDate(d.date), avg: d.avg_players, peak: d.peak_players, visitsGained: d.total_visits_delta })), [dailyStats]);

  const hasHourly = hourlyData.length > 1;
  const hasDaily = dailyData.length > 1;
  const robloxUrl = game.place_id ? `https://www.roblox.com/games/${game.place_id}` : null;

  const editorialAnalysis = useMemo(
    () => buildEditorialAnalysis(game, snapshots, dailyStats, rank, peak24h),
    [game, snapshots, dailyStats, rank, peak24h]
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #0f0f23 0%, #0a0a14 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "48px 0 36px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <nav style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24, display: "flex", gap: 6, alignItems: "center" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>BloxQuiz</Link>
            <span>/</span>
            <Link href="/stats" style={{ color: "inherit", textDecoration: "none" }}>Stats</Link>
            <span>/</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{game.name}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
            {game.thumbnail_url && (
              <div style={{ width: 80, height: 80, borderRadius: 16, overflow: "hidden", flexShrink: 0, border: "2px solid rgba(255,255,255,0.1)" }}>
                <Image src={game.thumbnail_url} alt={game.name} width={80} height={80} style={{ objectFit: "cover" }} />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 6px", lineHeight: 1.1 }}>
                {game.emoji && <span style={{ marginRight: 8 }}>{game.emoji}</span>}
                {game.name} Player Count &amp; Live Stats
              </h1>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
                {game.genre && (
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: "rgba(0,180,216,0.15)", color: "#00b4d8", textTransform: "capitalize" }}>{game.genre}</span>
                )}
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Updated {timeAgo(game.last_updated)}</span>
                {robloxUrl && (
                  <a href={robloxUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#00b4d8", textDecoration: "none" }}>Play on Roblox ↗</a>
                )}
              </div>
              <FollowButton gameSlug={slug} gameName={game.name} />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 80px" }}>

        {/* Quick Answer block */}
        {game.intro && (
          <div style={{ background: "linear-gradient(135deg, #0f1629 0%, #111827 100%)", border: "1px solid rgba(0,180,216,0.2)", borderLeft: "3px solid #00b4d8", borderRadius: 12, padding: "20px 24px", marginBottom: 32 }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>{game.intro}</p>
          </div>
        )}

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 40 }}>
          <StatCard label="Playing Now" value={formatNumber(game.current_players)} sub="concurrent players" accent />
          <StatCard label="24h Peak" value={formatNumber(peak24h)} sub="highest this period" />
          <StatCard label="Total Visits" value={formatVisits(game.total_visits)} sub="all-time" />
          <StatCard label="Favorites" value={formatNumber(game.favorites)} />
          {approvalRate && <StatCard label="Approval" value={`${approvalRate}%`} sub={`${formatNumber(game.likes)} likes`} />}
          {rank && <StatCard label="Player Rank" value={`#${rank}`} sub="among tracked games" />}
        </div>

        {/* Hourly chart */}
        {hasHourly && (
          <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px", marginBottom: 24 }}>
            <SectionHeading>📈 Player Count — Last 48 Hours</SectionHeading>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="playerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00b4d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatNumber} width={52} />
                <Tooltip contentStyle={customTooltipStyle} formatter={(v) => [formatNumber(v as number), "Players"]} labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }} />
                <Area type="monotone" dataKey="players" stroke="#00b4d8" strokeWidth={2} fill="url(#playerGrad)" dot={false} activeDot={{ r: 4, fill: "#00b4d8" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Daily chart */}
        {hasDaily && (
          <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px", marginBottom: 24 }}>
            <SectionHeading>📊 Daily Average Players — Last 30 Days</SectionHeading>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatNumber} width={52} />
                <Tooltip contentStyle={customTooltipStyle} formatter={(v, name) => [formatNumber(v as number), name === "avg" ? "Avg Players" : "Peak Players"]} labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }} />
                <Bar dataKey="avg" fill="#0077b6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="peak" fill="#00b4d8" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Dark = daily average · Light = daily peak</p>
          </div>
        )}

        {/* No data yet */}
        {!hasHourly && !hasDaily && (
          <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "40px 24px", marginBottom: 24, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
            <p style={{ margin: 0, fontSize: 15 }}>📡 Collecting data... Charts will appear after the first few hourly snapshots.</p>
          </div>
        )}

        {/* Editorial analysis */}
        {editorialAnalysis && (
          <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "28px 28px", marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              🔍 {game.name} Player Count Analysis
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {editorialAnalysis.split("\n\n").map((para, i) => (
                <p key={i} style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                  {para}
                </p>
              ))}
            </div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
              Analysis based on tracked data · Updated hourly · BloxQuiz.gg
            </div>
          </div>
        )}

        {/* Affiliate placement */}
        <div style={{ marginBottom: 32 }}>
          <RobuxCTA variant="card" game={game.name} />
        </div>

        {/* Quiz CTA */}
        <QuizCTA gameName={game.name} gameSlug={slug} gameEmoji={game.emoji} quizCount={quizCount} />

        {/* Cross-links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 40 }}>
          <Link href={`/games/${slug}`} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
            <span style={{ fontSize: 20 }}>🧠</span>
            <span>{quizCount > 0 ? `${quizCount} ${game.name} Quizzes` : `${game.name} Quizzes`}</span>
          </Link>
          <Link href={`/codes/${slug}`} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
            <span style={{ fontSize: 20 }}>🎁</span>
            <span>{game.name} Codes</span>
          </Link>
          <Link href={`/stats/${slug}/history`} style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
            <span style={{ fontSize: 20 }}>📅</span>
            <span>{game.name} History</span>
          </Link>
          <Link href="/stats" style={{ display: "flex", alignItems: "center", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", textDecoration: "none", color: "#fff", fontWeight: 600, fontSize: 14 }}>
            <span style={{ fontSize: 20 }}>📊</span>
            <span>All Game Stats</span>
          </Link>
        </div>

        {/* Compare section */}
        {compareGames.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <SectionHeading>⚔️ Compare {game.name} vs Other Games</SectionHeading>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {compareGames.map((other) => (
                <Link
                  key={other.slug}
                  href={compareUrl(slug, other.slug)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 16px", textDecoration: "none", color: "#fff" }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {other.emoji && <span style={{ marginRight: 6 }}>{other.emoji}</span>}
                    {other.name}
                  </span>
                  <span style={{ fontSize: 11, color: "#00b4d8", fontWeight: 700, whiteSpace: "nowrap" }}>
                    {formatNumber(other.current_players)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {allFaqs.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <SectionHeading>❓ Frequently Asked Questions</SectionHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {allFaqs.map((faq, i) => (
                <div key={i} style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}>
                  <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 15, color: "#fff" }}>{faq.q}</p>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.6)" }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", margin: 0 }}>
          {game.name} stats updated hourly via the Roblox API · Last updated {timeAgo(game.last_updated)} · BloxQuiz.gg
        </p>
      </div>
    </div>
  );
}