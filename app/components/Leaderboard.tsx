"use client";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [period, setPeriod] = useState("weekly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  async function fetchLeaderboard() {
    setLoading(true);
    const res = await fetch(`/api/leaderboard?period=${period}`);
    const data = await res.json();
    setLeaderboard(data.leaderboard || []);
    setLoading(false);
  }

  const medals = ["👑", "🥈", "🥉"];
  const rankColors = ["var(--neon-yellow)", "#C0C0C0", "#CD7F32"];

  return (
    <div id="leaderboard" style={{ position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>👑 Top Players This Week</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setPeriod("weekly")} style={{ padding: "6px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: period === "weekly" ? "var(--gradient-main)" : "var(--surface)", color: period === "weekly" ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: period === "weekly" ? "var(--bg)" : "var(--text-muted)" }}>Weekly</button>
          <button onClick={() => setPeriod("alltime")} style={{ padding: "6px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: period === "alltime" ? "var(--gradient-main)" : "var(--surface)", color: period === "alltime" ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: period === "alltime" ? "var(--bg)" : "var(--text-muted)" }}>All Time</button>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>Loading leaderboard...</div>
          ) : leaderboard.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No scores yet!</div>
              <div>Be the first to play and claim the #1 spot!</div>
            </div>
          ) : (
            leaderboard.map((player, i) => (
              <div key={player.user_id} style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 100px", alignItems: "center", padding: "14px 24px", borderBottom: i < leaderboard.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: rankColors[i] || "var(--text-dim)" }}>{player.rank}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: i < 3 ? `rgba(255,227,71,0.15)` : "var(--surface)" }}>{medals[i] || "🎮"}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{player.username}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{player.xp} XP</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700 }}>{player.quizzes_played} quizzes</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, background: "var(--gradient-main)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{player.total_score}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}