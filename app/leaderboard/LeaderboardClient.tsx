"use client";
import { useState } from "react";
import { getBadges } from "../lib/badges";

function getLevel(xp: number) {
  if (xp >= 10000) return { level: 50, title: "Roblox God" };
  if (xp >= 5000) return { level: 30, title: "Blox Legend" };
  if (xp >= 2000) return { level: 20, title: "Quiz Master" };
  if (xp >= 1000) return { level: 15, title: "Blox Expert" };
  if (xp >= 500) return { level: 10, title: "Rising Star" };
  if (xp >= 100) return { level: 5, title: "Noob Slayer" };
  return { level: 1, title: "Fresh Noob" };
}

const medals = ["👑", "🥈", "🥉"];
const rankColors = ["var(--neon-yellow)", "#C0C0C0", "#CD7F32"];

export default function LeaderboardClient({ initialLeaderboard }: { initialLeaderboard: any[] }) {
  const [leaderboard] = useState(initialLeaderboard);
  const [search, setSearch] = useState("");

  const filtered = leaderboard.filter(p =>
    p.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", marginBottom: 12 }}>
          {"👑 Leaderboard"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
          Top Roblox quiz players on BloxQuiz. Earn XP by playing quizzes and climb the ranks!
        </p>
      </div>

      {/* Top 3 podium */}
      {leaderboard.length >= 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((player, i) => {
            const podiumRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const isFirst = podiumRank === 1;
            const medal = medals[podiumRank - 1];
            const color = rankColors[podiumRank - 1];
            const { title } = getLevel(player.xp);
            return (
              <a key={player.user_id} href={"/profile/" + player.username} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "var(--bg-card)",
                  border: "1px solid " + color + "40",
                  borderRadius: "var(--radius)",
                  padding: isFirst ? "28px 20px" : "20px",
                  textAlign: "center",
                  position: "relative",
                  transform: isFirst ? "translateY(-12px)" : "none",
                  boxShadow: isFirst ? "0 8px 32px rgba(255,227,71,0.15)" : "none"
                }}>
                  <div style={{ fontSize: isFirst ? 48 : 36, marginBottom: 8 }}>{medal}</div>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--surface)", border: "2px solid " + color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color, fontFamily: "var(--font-display)", margin: "0 auto 10px" }}>
                    {player.username?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>{player.username}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 700, marginBottom: 8 }}>{title}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color }}>{player.xp.toLocaleString()} XP</div>
                  {player.streak > 0 && (
                    <div style={{ fontSize: 12, fontWeight: 800, color: "var(--neon-yellow)", marginTop: 6 }}>{"🔥 " + player.streak + " day streak"}</div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Search players..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "12px 20px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 100, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {/* Full leaderboard table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 100px", padding: "10px 24px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>
          <div>Rank</div>
          <div>Player</div>
          <div>Level</div>
          <div>XP</div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>No players found!</div>
        ) : (
          filtered.map((player, i) => {
            const { title } = getLevel(player.xp);
            const badges = getBadges({ rank: player.rank, streak: player.streak, xp: player.xp, totalQuizzes: 0, perfectScores: 0 });
            const topBadge = badges[0];
            return (
              <a key={player.user_id} href={"/profile/" + player.username} style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 100px", alignItems: "center", padding: "14px 24px", borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", textDecoration: "none", background: player.rank <= 3 ? "rgba(255,227,71,0.03)" : "transparent" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: rankColors[player.rank - 1] || "var(--text-dim)" }}>
                  {player.rank <= 3 ? medals[player.rank - 1] : player.rank}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                    {player.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>{player.username}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
                      {topBadge && (
                        <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 100, background: topBadge.bg, color: topBadge.color }}>
                          {topBadge.emoji + " " + topBadge.label}
                        </span>
                      )}
                      {player.streak > 0 && (
                        <span style={{ fontSize: 10, fontWeight: 800, color: "var(--neon-yellow)" }}>{"🔥 " + player.streak}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>{title}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, background: "var(--gradient-main)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {player.xp.toLocaleString()}
                </div>
              </a>
            );
          })
        )}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 32, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 32, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 8 }}>{"Want to climb the ranks?"}</div>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
          Play quizzes, earn XP and compete with players worldwide!
        </p>
        <a href="/browse" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 15, padding: "14px 32px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
          {"🎮 Start Playing"}
        </a>
      </div>

    </div>
  );
}