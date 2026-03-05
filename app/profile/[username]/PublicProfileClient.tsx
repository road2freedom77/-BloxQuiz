"use client";
import { useState } from "react";
import { getBadges } from "../../lib/badges";

function getLevel(xp: number) {
  if (xp >= 10000) return { level: 50, title: "Roblox God" };
  if (xp >= 5000) return { level: 30, title: "Blox Legend" };
  if (xp >= 2000) return { level: 20, title: "Quiz Master" };
  if (xp >= 1000) return { level: 15, title: "Blox Expert" };
  if (xp >= 500) return { level: 10, title: "Rising Star" };
  if (xp >= 100) return { level: 5, title: "Noob Slayer" };
  return { level: 1, title: "Fresh Noob" };
}

function getXPForNextLevel(xp: number) {
  const thresholds = [100, 500, 1000, 2000, 5000, 10000];
  for (const t of thresholds) {
    if (xp < t) return { next: t, pct: Math.round((xp / t) * 100) };
  }
  return { next: 10000, pct: 100 };
}

const PRIZE_AMOUNTS: Record<number, string> = { 1: "$20", 2: "$15", 3: "$10" };

export default function PublicProfileClient({
  userData,
  scores,
  rank,
  seasonRank,
  seasonScore,
  seasonQuizzes,
  prizeData,
}: {
  userData: any,
  scores: any[],
  rank: number | null,
  seasonRank: number | null,
  seasonScore: number,
  seasonQuizzes: number,
  prizeData: any | null,
}) {
  const [copied, setCopied] = useState(false);
  const xp = userData?.xp || 0;
  const streak = userData?.streak || 0;
  const longestStreak = userData?.longest_streak || streak;
  const { level, title } = getLevel(xp);
  const { next, pct } = getXPForNextLevel(xp);

  const totalQuizzes = scores.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(scores.reduce((sum, s) => sum + (s.score / s.total_questions) * 100, 0) / totalQuizzes)
    : 0;
  const perfectScores = scores.filter(s => s.score === s.total_questions).length;

  const badges = getBadges({ rank, streak, xp, totalQuizzes, perfectScores });

  const isPrizeWinner = prizeData && prizeData.rank <= 3 && prizeData.reward_status === "pending";
  const qualifiesThisSeason = seasonQuizzes >= 10;

  function copyProfileLink() {
    navigator.clipboard.writeText("https://www.bloxquiz.gg/profile/" + userData.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Prize Winner Inbox */}
      {isPrizeWinner && (
        <div style={{ background: "linear-gradient(135deg, rgba(255,227,71,0.12), rgba(184,76,255,0.08))", border: "2px solid rgba(255,227,71,0.4)", borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "var(--neon-yellow)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>🎉 You Won a Prize!</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 4 }}>
              {"Season 1 — Rank #" + prizeData.rank + " — " + (PRIZE_AMOUNTS[prizeData.rank] || "") + " Roblox Gift Card"}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>Claim your prize before the end of the month!</div>
          </div>
          <a href="/rewards/claim" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 24px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)", flexShrink: 0 }}>
            🎁 Claim Prize
          </a>
        </div>
      )}

      {/* Profile Header */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 32, marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40%", right: "-10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(184,76,255,0.08), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid var(--neon-green)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, color: "var(--neon-green)", fontFamily: "var(--font-display)" }}>
              {userData.username?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 4 }}>{userData.username}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 800, padding: "3px 12px", borderRadius: 100, background: "rgba(184,76,255,0.15)", color: "#B84CFF" }}>
                  {"Level " + level + " — " + title}
                </span>
                {streak > 0 && (
                  <span style={{ fontSize: 12, fontWeight: 800, padding: "3px 12px", borderRadius: 100, background: "rgba(255,227,71,0.1)", color: "var(--neon-yellow)" }}>
                    {"🔥 " + streak + " Day Streak"}
                  </span>
                )}
                {rank && rank <= 10 && (
                  <span style={{ fontSize: 12, fontWeight: 800, padding: "3px 12px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "var(--neon-green)" }}>
                    {"👑 Rank #" + rank}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={copyProfileLink}
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 100, padding: "10px 20px", fontSize: 13, fontWeight: 800, cursor: "pointer", color: "var(--text)", fontFamily: "var(--font-body)" }}>
              {copied ? "✅ Copied!" : "🔗 Share Profile"}
            </button>
            <a href="/browse" style={{ background: "var(--gradient-main)", borderRadius: 100, padding: "10px 20px", fontSize: 13, fontWeight: 800, color: "var(--bg)", textDecoration: "none", WebkitTextFillColor: "var(--bg)", display: "inline-flex", alignItems: "center" }}>
              {"⚡ Challenge Me"}
            </a>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--neon-yellow)" }}>{xp.toLocaleString()}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase", marginLeft: 8 }}>XP</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-dim)" }}>{"Next level: " + next.toLocaleString() + " XP"}</div>
        </div>
        <div style={{ background: "var(--surface)", height: 10, borderRadius: 100, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ height: "100%", width: pct + "%", background: "var(--gradient-main)", borderRadius: 100 }} />
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Badges</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {badges.map(badge => (
                <div key={badge.id} title={badge.description} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, background: badge.bg, border: "1px solid " + badge.color + "30", cursor: "default" }}>
                  <span style={{ fontSize: 16 }}>{badge.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: badge.color }}>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Quizzes Played", value: totalQuizzes, color: "var(--neon-blue)" },
          { label: "Avg Score", value: avgScore + "%", color: "var(--neon-green)" },
          { label: "Best Streak", value: longestStreak + " days", color: "var(--neon-yellow)" },
          { label: "Perfect Scores", value: perfectScores, color: "#B84CFF" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Season 1 Block */}
      <div style={{ background: "linear-gradient(135deg, rgba(184,76,255,0.1), rgba(255,60,172,0.06))", border: "1px solid rgba(184,76,255,0.25)", borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#B84CFF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>🏆 Season 1 — March 2026</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--neon-green)" }}>
                  {seasonScore > 0 ? seasonScore.toLocaleString() : "—"}
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>Season Points</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#B84CFF" }}>
                  {seasonRank ? "#" + seasonRank : "—"}
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>Season Rank</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: seasonQuizzes >= 10 ? "var(--neon-green)" : "var(--neon-yellow)" }}>
                  {seasonQuizzes + "/10"}
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>Quizzes to Qualify</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            {qualifiesThisSeason && seasonRank && seasonRank <= 3 ? (
              <span style={{ fontSize: 12, fontWeight: 900, padding: "6px 16px", borderRadius: 100, background: "rgba(255,227,71,0.15)", color: "var(--neon-yellow)", border: "1px solid rgba(255,227,71,0.3)" }}>
                {"🏆 Prize Eligible — Rank #" + seasonRank}
              </span>
            ) : qualifiesThisSeason ? (
              <span style={{ fontSize: 12, fontWeight: 800, padding: "6px 16px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "var(--neon-green)" }}>
                ✓ Qualifies for prizes
              </span>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 800, padding: "6px 16px", borderRadius: 100, background: "rgba(255,227,71,0.1)", color: "var(--neon-yellow)" }}>
                {"Need " + Math.max(0, 10 - seasonQuizzes) + " more quizzes to qualify"}
              </span>
            )}
            <a href="/leaderboard" style={{ fontSize: 12, fontWeight: 800, color: "#B84CFF", textDecoration: "none" }}>View Leaderboard →</a>
          </div>
        </div>
      </div>

      {/* Recent Scores */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>{"📊 Recent Quizzes"}</h2>
        {scores.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontWeight: 600 }}>
            {userData.username + " hasn't played any quizzes yet!"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {scores.map((s, i) => {
              const pct = Math.round((s.score / s.total_questions) * 100);
              return (
                <a key={i} href={"/quiz/" + s.quiz_slug} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: "12px 16px", textDecoration: "none", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>
                      {s.quiz_slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>
                      {new Date(s.completed_at || s.played_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: pct >= 90 ? "var(--neon-green)" : pct >= 70 ? "var(--neon-yellow)" : "var(--neon-pink)" }}>
                      {s.score + "/" + s.total_questions}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 100, background: pct >= 70 ? "rgba(0,245,160,0.1)" : "rgba(255,60,172,0.1)", color: pct >= 70 ? "var(--neon-green)" : "var(--neon-pink)" }}>
                      {pct + "%"}
                    </div>
                    {s.weighted_score > 0 && (
                      <div style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 100, background: "rgba(184,76,255,0.1)", color: "#B84CFF" }}>
                        {"+" + s.weighted_score + " pts"}
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 24, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>
          {"Think you can beat " + userData.username + "?"}
        </div>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>
          Create your free account and start climbing the leaderboard!
        </p>
        <a href="/browse" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
          {"🎮 Start Playing"}
        </a>
      </div>

    </div>
  );
}