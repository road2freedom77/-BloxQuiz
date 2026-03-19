"use client";

import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface DailyStatRow {
  date: string;
  avg_players: number;
  peak_players: number;
  min_players: number;
  total_visits_delta: number;
}

interface Props {
  dailyStats: DailyStatRow[];
  gameName: string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const tooltipStyle = {
  background: "#0d0d1a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#fff",
  fontSize: 13,
};

export default function StatsHistoryClient({ dailyStats, gameName }: Props) {
  const chartData = useMemo(
    () => [...dailyStats].reverse().map((d) => ({
      date: formatDate(d.date),
      avg: d.avg_players,
      peak: d.peak_players,
      min: d.min_players,
      visits: d.total_visits_delta,
    })),
    [dailyStats]
  );

  if (dailyStats.length === 0) {
    return (
      <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "40px 24px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
        <p style={{ margin: 0, fontSize: 15 }}>
          📡 Collecting history data... Daily stats will appear here after the first full day of tracking.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Avg + Peak area chart */}
      <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>📈 Daily Average & Peak Players</h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
          Blue = daily average · Teal = daily peak
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0077b6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0077b6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00b4d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatNumber} width={52} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v, name) => [formatNumber(v as number), name === "avg" ? "Avg Players" : "Peak Players"]}
              labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }}
            />
            <Area type="monotone" dataKey="avg" stroke="#0077b6" strokeWidth={2} fill="url(#avgGrad)" dot={false} />
            <Area type="monotone" dataKey="peak" stroke="#00b4d8" strokeWidth={2} fill="url(#peakGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily visits bar chart */}
      <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>📊 Daily Visits Gained</h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
          New visits {gameName} received each day
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatNumber} width={52} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [formatNumber(v as number), "Visits Gained"]}
              labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }}
            />
            <Bar dataKey="visits" fill="#00b4d8" radius={[4, 4, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}