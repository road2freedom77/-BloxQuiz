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

const PRIZE_TIERS = [
  { rank: "1st", prize: "$10 Roblox Gift Card", color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)", medal: "👑" },
  { rank: "2nd", prize: "$5 Roblox Gift Card", color: "#C0C0C0", bg: "rgba(192,192,192,0.1)", medal: "🥈" },
  { rank: "3rd", prize: "$5 Roblox Gift Card", color: "#CD7F32", bg: "rgba(205,127,50,0.1)", medal: "🥉" },
  { rank: "4th–10th", prize: "$1 Roblox Gift Card", color: "#B84CFF", bg: "rgba(184,76,255,0.1)", medal: "🎖️" },
];

function getDaysUntilReset() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diff = nextMonth.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function LeaderboardClient({
  allTimeLeaderboard,
  seasonLeaderboard,
}: {
  allTimeLeaderboard: any[],
  seasonLeaderboard: any[],
}) {
  const [tab, setTab] = useState<"season" | "alltime">("season");
  const [search, setSearch] = useState("");
  const daysLeft = getDaysUntilReset();

  const seasonFiltered = seasonLeaderboard.filter(p =>
    p.username?.toLowerCase().includes(search.toLowerCase())
  );
  const allTimeFiltered = allTimeLeaderboard.filter(p =>
    p.username?.toLowerCase().includes(search.toLowerCase())
  );

  const top3 = allTimeLeaderboard.slice(0, 3);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Season 1 hype banner */}
      <div style={{ background: "linear-gradient(135deg, rgba(184,76,255,0.15), rgba(255,60,172,0.1))", border: "1px solid rgba(184,76,255,0.4)", borderRadius: "var(--radius)", padding: "24px 28px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#B84CFF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>🏆 Season 1 — Active Now</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 6 }}>Win Roblox Gift Cards</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Top players win real prizes. Play quizzes, earn points, claim your reward.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--neon-pink)" }}>{daysLeft + " days"}</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>until season reset</div>
          <a href="/rules" style={{ fontSize: 12, fontWeight: 800, color: "#B84CFF", textDecoration: "none" }}>View Rules →</a>
        </div>
      </div>

      {/* Prize tiers */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>🎁 Season 1 Prize Tiers</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          {PRIZE_TIERS.map((tier, i) => (
            <div key={i} style={{ background: tier.bg, border: "1px solid " + tier.color + "40", borderRadius: "var(--radius-sm)", padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{tier.medal}</div>
              <div style={{ fontWeight: 900, fontSize: 14, color: tier.color, marginBottom: 4 }}>{tier.rank}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>{tier.prize}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600, marginTop: 10 }}>
          * Top 10 must complete 10+ quizzes to qualify. <a href="/rules" style={{ color: "#B84CFF", textDecoration: "none" }}>Full rules →</a>
        </div>
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", marginBottom: 12 }}>{"👑 Leaderboard"}</h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
          Compete for Roblox gift cards every month. Hard quizzes = 2x points. Daily streaks = bonus points.
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "var(--surface)", padding: 6, borderRadius: 100, width: "fit-content" }}>
        {[
          { key: "season", label: "🏆 Season 1" },
          { key: "alltime", label: "⭐ All Time XP" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding: "8px 22px", borderRadius: 100, border: "none", background: tab === t.key ? "var(--gradient-main)" : "transparent", color: tab === t.key ? "var(--bg)" : "var(--text-muted)", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: tab === t.key ? "var(--bg)" : "var(--text-muted)", transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input type="text" placeholder="🔍 Search players..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "12px 20px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 100, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
      </div>

      {/* Season leaderboard */}
      {tab === "season" && (
        <>
          {seasonLeaderboard.length === 0 ? (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>Season 1 Just Started!</div>
              <div style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>No scores yet this month. Be the first to climb the leaderboard!</div>
              <a href="/browse" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>🎮 Start Playing</a>
            </div>
          ) : (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 100px 80px", padding: "10px 24px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>
                <div>Rank</div>
                <div>Player</div>
                <div>Score</div>
                <div>Quizzes</div>
                <div>Accuracy</div>
              </div>
              {seasonFiltered.map((player, i) => (
                <a key={player.user_id} href={"/profile/" + player.username}
                  style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 100px 80px", alignItems: "center", padding: "14px 24px", borderBottom: i < seasonFiltered.length - 1 ? "1px solid var(--border)" : "none", textDecoration: "none", background: player.rank <= 3 ? "rgba(255,227,71,0.03)" : "transparent" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: rankColors[player.rank - 1] || "var(--text-dim)" }}>
                    {player.rank <= 3 ? medals[player.rank - 1] : player.rank}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "var(--text-muted)", fontFamily: "var(--font-display)", flexShrink: 0 }}>
                      {player.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>{player.username}</span>
                        {player.is_flagged && <span style={{ fontSize: 10, color: "var(--neon-pink)" }}>⚠️</span>}
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                        {!player.qualifies && (
                          <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 100, background: "rgba(255,227,71,0.1)", color: "var(--neon-yellow)" }}>Need 10 quizzes</span>
                        )}
                        {player.qualifies && player.rank <= 10 && (
                          <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "var(--neon-green)" }}>✓ Qualifies</span>
                        )}
                        {player.streak > 0 && (
                          <span style={{ fontSize: 10, fontWeight: 800, color: "var(--neon-yellow)" }}>{"🔥 " + player.streak}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 16, background: "var(--gradient-main)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {player.monthly_score.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700 }}>{player.quizzes_completed}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700 }}>{player.avg_accuracy + "%"}</div>
                </a>
              ))}
            </div>
          )}
        </>
      )}

      {/* All time leaderboard */}
      {tab === "alltime" && (
        <>
          {/* Top 3 podium */}
          {allTimeLeaderboard.length >= 3 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
              {[top3[1], top3[0], top3[2]].map((player, i) => {
                const podiumRank = i === 0 ? 2 : i === 1 ? 1 : 3;
                const isFirst = podiumRank === 1;
                const medal = medals[podiumRank - 1];
                const color = rankColors[podiumRank - 1];
                const { title } = getLevel(player.xp);
                return (
                  <a key={player.user_id} href={"/profile/" + player.username} style={{ textDecoration: "none" }}>
                    <div style={{ background: "var(--bg-card)", border: "1px solid " + color + "40", borderRadius: "var(--radius)", padding: isFirst ? "28px 20px" : "20px", textAlign: "center", transform: isFirst ? "translateY(-12px)" : "none", boxShadow: isFirst ? "0 8px 32px rgba(255,227,71,0.15)" : "none" }}>
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

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 100px", padding: "10px 24px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>
              <div>Rank</div>
              <div>Player</div>
              <div>Level</div>
              <div>XP</div>
            </div>
            {allTimeFiltered.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>No players found!</div>
            ) : (
              allTimeFiltered.map((player, i) => {
                const { title } = getLevel(player.xp);
                const badges = getBadges({ rank: player.rank, streak: player.streak, xp: player.xp, totalQuizzes: 0, perfectScores: 0 });
                const topBadge = badges[0];
                return (
                  <a key={player.user_id} href={"/profile/" + player.username}
                    style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 100px", alignItems: "center", padding: "14px 24px", borderBottom: i < allTimeFiltered.length - 1 ? "1px solid var(--border)" : "none", textDecoration: "none", background: player.rank <= 3 ? "rgba(255,227,71,0.03)" : "transparent" }}>
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
        </>
      )}

      {/* CTA */}
      <div style={{ marginTop: 32, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 32, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 8 }}>{"🏆 Want to win Robux?"}</div>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
          Play quizzes, earn points and finish in the top 10 this month to win Roblox gift cards!
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/browse" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 15, padding: "14px 32px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>🎮 Start Playing</a>
          <a href="/rules" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "14px 24px", borderRadius: 100, textDecoration: "none" }}>📋 View Rules</a>
        </div>
      </div>

    </div>
  );
}