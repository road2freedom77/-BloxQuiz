"use client";

const diffColors: Record<string, { color: string, bg: string }> = {
  Easy: { color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" },
  Medium: { color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" },
  Hard: { color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" },
};

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

export default function ProfileClient({ user, userData, scores, rank }: {
  user: { id: string, username: string, email: string, imageUrl: string },
  userData: any,
  scores: any[],
  rank: number | null
}) {
  const xp = userData?.xp || 0;
  const streak = userData?.streak || 0;
  const { level, title } = getLevel(xp);
  const { next, pct } = getXPForNextLevel(xp);

  const totalQuizzes = scores.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(scores.reduce((sum, s) => sum + (s.score / s.total_questions) * 100, 0) / totalQuizzes)
    : 0;
  const perfectScores = scores.filter(s => s.score === s.total_questions).length;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Profile Header */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 32, marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40%", right: "-10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(184,76,255,0.08), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <img src={user.imageUrl} alt="avatar" style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid var(--neon-green)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 4 }}>{user.username}</div>
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
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--neon-yellow)" }}>{xp.toLocaleString()}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>Total XP</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "var(--text-dim)", marginBottom: 6 }}>
            <span>{xp.toLocaleString()} XP</span>
            <span>{"Next level: " + next.toLocaleString() + " XP"}</span>
          </div>
          <div style={{ background: "var(--surface)", height: 10, borderRadius: 100, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct + "%", background: "var(--gradient-main)", borderRadius: 100, transition: "width 0.6s ease" }} />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Quizzes Played", value: totalQuizzes, color: "var(--neon-blue)" },
          { label: "Avg Score", value: avgScore + "%", color: "var(--neon-green)" },
          { label: "Perfect Scores", value: perfectScores, color: "var(--neon-yellow)" },
          { label: "Leaderboard Rank", value: rank ? "#" + rank : "—", color: "#B84CFF" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Scores */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>{"📊 Recent Quizzes"}</h2>
        {scores.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)", fontWeight: 600 }}>
            {"No quizzes played yet! "}
            <a href="/browse" style={{ color: "var(--neon-green)", textDecoration: "none", fontWeight: 800 }}>Play your first quiz →</a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {scores.map((s, i) => {
              const pct = Math.round((s.score / s.total_questions) * 100);
              const diff = diffColors[s.difficulty] || diffColors.Medium;
              return (
                <a key={i} href={"/quiz/" + s.quiz_slug} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: "12px 16px", textDecoration: "none", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>{s.quiz_slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{new Date(s.played_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: pct >= 90 ? "var(--neon-green)" : pct >= 70 ? "var(--neon-yellow)" : "var(--neon-pink)" }}>
                      {s.score + "/" + s.total_questions}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 100, background: pct >= 70 ? "rgba(0,245,160,0.1)" : "rgba(255,60,172,0.1)", color: pct >= 70 ? "var(--neon-green)" : "var(--neon-pink)" }}>
                      {pct + "%"}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}