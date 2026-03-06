"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
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
  { rank: "1st", prize: "$20 Roblox Gift Card", color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)", medal: "👑" },
  { rank: "2nd", prize: "$15 Roblox Gift Card", color: "#C0C0C0", bg: "rgba(192,192,192,0.1)", medal: "🥈" },
  { rank: "3rd", prize: "$10 Roblox Gift Card", color: "#CD7F32", bg: "rgba(205,127,50,0.1)", medal: "🥉" },
];

const SCORING_RULES = [
  { label: "Easy quiz", value: "1x points", color: "var(--neon-green)" },
  { label: "Medium quiz", value: "1.5x points", color: "var(--neon-yellow)" },
  { label: "Hard quiz", value: "2x points", color: "var(--neon-pink)" },
  { label: "Streak day 3", value: "+25 bonus", color: "#B84CFF" },
  { label: "Streak day 7", value: "+100 bonus", color: "#B84CFF" },
  { label: "Streak day 14", value: "+200 bonus", color: "#B84CFF" },
  { label: "Daily cap", value: "20 quizzes", color: "var(--neon-blue)" },
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
  seasonClosed = false,
  seasonName = "Season 1",
}: {
  allTimeLeaderboard: any[];
  seasonLeaderboard: any[];
  seasonClosed?: boolean;
  seasonName?: string;
}) {
  const { isSignedIn, user } = useUser();
  const [tab, setTab] = useState<"season" | "alltime">("season");
  const [search, setSearch] = useState("");
  const [mySeasonData, setMySeasonData] = useState<any | null>(null);
  const daysLeft = getDaysUntilReset();

  useEffect(() => {
    if (!user?.id) return;
    const found = seasonLeaderboard.find(p => p.user_id === user.id);
    if (found) setMySeasonData(found);
  }, [user?.id, seasonLeaderboard]);

  const seasonFiltered = seasonLeaderboard.filter(p =>
    p.username?.toLowerCase().includes(search.toLowerCase())
  );
  const allTimeFiltered = allTimeLeaderboard.filter(p =>
    p.username?.toLowerCase().includes(search.toLowerCase())
  );

  const top3 = allTimeLeaderboard.slice(0, 3);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Season banner — dynamic */}
      {seasonClosed ? (
        <div style={{ background: "linear-gradient(135deg, rgba(255,60,172,0.1), rgba(184,76,255,0.08))", border: "1px solid rgba(255,60,172,0.3)", borderRadius: "var(--radius)", padding: "24px 28px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "var(--neon-pink)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>⛔ {seasonName} — Ended</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 6 }}>Final Standings</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Season is over. Scores are locked. Season 2 coming soon!</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <a href="/champions" style={{ fontSize: 13, fontWeight: 900, padding: "10px 22px", borderRadius: 100, background: "rgba(255,60,172,0.15)", color: "var(--neon-pink)", border: "1px solid rgba(255,60,172,0.3)", textDecoration: "none" }}>🏆 View Champions →</a>
            <a href="/rules" style={{ fontSize: 12, fontWeight: 800, color: "#B84CFF", textDecoration: "none" }}>View Rules →</a>
          </div>
        </div>
      ) : (
        <div style={{ background: "linear-gradient(135deg, rgba(184,76,255,0.15), rgba(255,60,172,0.1))", border: "1px solid rgba(184,76,255,0.4)", borderRadius: "var(--radius)", padding: "24px 28px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#B84CFF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>🏆 {seasonName} — Active Now</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 6 }}>Win Roblox Gift Cards</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Top players win real prizes. Play quizzes, earn points, claim your reward.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--neon-pink)" }}>{daysLeft + " days"}</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>until season reset</div>
            <a href="/rules" style={{ fontSize: 12, fontWeight: 800, color: "#B84CFF", textDecoration: "none" }}>View Rules →</a>
          </div>
        </div>
      )}

      {/* Your Rank module */}
      {isSignedIn ? (
        mySeasonData ? (
          <div style={{ background: "var(--bg-card)", border: "1px solid rgba(0,245,160,0.25)", borderRadius: "var(--radius)", padding: "18px 24px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "var(--neon-green)", textTransform: "uppercase", letterSpacing: 1 }}>📊 Your {seasonName} Rank</div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: mySeasonData.rank <= 3 ? rankColors[mySeasonData.rank - 1] : "var(--text)" }}>{"#" + mySeasonData.rank}</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>Rank</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--neon-green)" }}>{mySeasonData.monthly_score.toLocaleString()}</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>Points</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: mySeasonData.quizzes_completed >= 10 ? "var(--neon-green)" : "var(--neon-yellow)" }}>
                  {mySeasonData.quizzes_completed + "/10"}
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>Quizzes</div>
              </div>
            </div>
            <div>
              {mySeasonData.quizzes_completed >= 10 && mySeasonData.rank <= 3 ? (
                <span style={{ fontSize: 12, fontWeight: 900, padding: "6px 16px", borderRadius: 100, background: "rgba(255,227,71,0.15)", color: "var(--neon-yellow)", border: "1px solid rgba(255,227,71,0.3)" }}>🏆 Prize Eligible!</span>
              ) : mySeasonData.quizzes_completed >= 10 ? (
                <span style={{ fontSize: 12, fontWeight: 800, padding: "6px 16px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "var(--neon-green)" }}>✓ Qualifies</span>
              ) : (
                <span style={{ fontSize: 12, fontWeight: 800, padding: "6px 16px", borderRadius: 100, background: "rgba(255,227,71,0.1)", color: "var(--neon-yellow)" }}>
                  {"Need " + Math.max(0, 10 - mySeasonData.quizzes_completed) + " more quizzes"}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 24px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>📊 Your {seasonName} Rank</div>
              <div style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600 }}>You haven't played any quizzes this season yet!</div>
            </div>
            <a href="/browse" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 13, padding: "10px 22px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)", flexShrink: 0 }}>🎮 Start Playing</a>
          </div>
        )
      ) : (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 24px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)" }}>🔒 Sign in to see your rank and track your progress</div>
          <a href="/sign-in" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 13, padding: "10px 22px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)", flexShrink: 0 }}>Sign In</a>
        </div>
      )}

      {/* Prize tiers */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>🎁 {seasonName} Prize Tiers</div>
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
          * Top 3 must complete 10+ quizzes to qualify. <a href="/rules" style={{ color: "#B84CFF", textDecoration: "none" }}>Full rules →</a>
        </div>
      </div>

      {/* Scoring rules */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 24px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>⚡ How Points Work</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
          {SCORING_RULES.map(rule => (
            <div key={rule.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", borderRadius: 8, padding: "8px 12px" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>{rule.label}</span>
              <span style={{ fontSize: 12, fontWeight: 900, color: rule.color }}>{rule.value}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, fontWeight: 700, color: "var(--text-dim)", padding: "8px 12px", background: "rgba(255,60,172,0.05)", borderRadius: 8, border: "1px solid rgba(255,60,172,0.15)" }}>
          🛡️ Anti-bot checks enabled. Suspicious activity is automatically flagged and disqualifies accounts.
        </div>
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 48px)", marginBottom: 12 }}>{"👑 Leaderboard"}</h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
          {seasonClosed
            ? "Season 1 is over. These are the final standings."
            : "Compete for Roblox gift cards every month. Hard quizzes = 2x points. Daily streaks = bonus points."}
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "var(--surface)", padding: 6, borderRadius: 100, width: "fit-content" }}>
        {[
          { key: "season", label: "🏆 " + seasonName },
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
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>
                {seasonClosed ? "Season Ended" : seasonName + " Just Started!"}
              </div>
              <div style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
                {seasonClosed ? "No scores were recorded this season." : "No scores yet this month. Be the first to climb the leaderboard!"}
              </div>
              {!seasonClosed && (
                <a href="/browse" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>🎮 Start Playing</a>
              )}
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
              {seasonFiltered.map((player, i) => {
                const isMe = user?.id === player.user_id;
                return (
                  <a key={player.user_id} href={"/profile/" + player.username}
                    style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 100px 80px", alignItems: "center", padding: "14px 24px", borderBottom: i < seasonFiltered.length - 1 ? "1px solid var(--border)" : "none", textDecoration: "none", background: isMe ? "rgba(0,245,160,0.04)" : player.rank <= 3 ? "rgba(255,227,71,0.03)" : "transparent", outline: isMe ? "1px solid rgba(0,245,160,0.2)" : "none" }}>
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
                          {isMe && <span style={{ fontSize: 10, fontWeight: 900, padding: "1px 6px", borderRadius: 100, background: "rgba(0,245,160,0.15)", color: "var(--neon-green)" }}>You</span>}
                          {player.is_flagged && <span style={{ fontSize: 10, color: "var(--neon-pink)" }}>⚠️</span>}
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                          {!player.qualifies && (
                            <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 100, background: "rgba(255,227,71,0.1)", color: "var(--neon-yellow)" }}>Need 10 quizzes</span>
                          )}
                          {player.qualifies && player.rank <= 3 && (
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
                );
              })}
            </div>
          )}
        </>
      )}

      {/* All time leaderboard */}
      {tab === "alltime" && (
        <>
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
              <div>Rank</div><div>Player</div><div>Level</div><div>XP</div>
            </div>
            {allTimeFiltered.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>No players found!</div>
            ) : (
              allTimeFiltered.map((player, i) => {
                const { title } = getLevel(player.xp);
                const badges = getBadges({ rank: player.rank, streak: player.streak, xp: player.xp, totalQuizzes: 0, perfectScores: 0 });
                const topBadge = badges[0];
                const isMe = user?.id === player.user_id;
                return (
                  <a key={player.user_id} href={"/profile/" + player.username}
                    style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 100px", alignItems: "center", padding: "14px 24px", borderBottom: i < allTimeFiltered.length - 1 ? "1px solid var(--border)" : "none", textDecoration: "none", background: isMe ? "rgba(0,245,160,0.04)" : player.rank <= 3 ? "rgba(255,227,71,0.03)" : "transparent" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: rankColors[player.rank - 1] || "var(--text-dim)" }}>
                      {player.rank <= 3 ? medals[player.rank - 1] : player.rank}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                        {player.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>{player.username}</span>
                          {isMe && <span style={{ fontSize: 10, fontWeight: 900, padding: "1px 6px", borderRadius: 100, background: "rgba(0,245,160,0.15)", color: "var(--neon-green)" }}>You</span>}
                        </div>
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
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 8 }}>
          {seasonClosed ? "Season 2 is coming." : "🏆 Want to win Robux?"}
        </div>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
          {seasonClosed
            ? "Keep playing to get ahead before the next season kicks off."
            : "Play quizzes, earn points and finish in the top 3 this month to win Roblox gift cards!"}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/browse" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 15, padding: "14px 32px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>🎮 Start Playing</a>
          <a href="/rules" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "14px 24px", borderRadius: 100, textDecoration: "none" }}>📋 View Rules</a>
        </div>
      </div>

    </div>
  );
}