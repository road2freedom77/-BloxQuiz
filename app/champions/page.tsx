export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { supabase } from "../lib/supabase";

export const metadata: Metadata = {
  title: "Champions | BloxQuiz.gg",
  description: "BloxQuiz.gg Hall of Fame — past season winners and leaderboard champions.",
};

async function getCurrentSeason() {
  const { data } = await supabase
    .from("seasons")
    .select("*")
    .order("start_date", { ascending: false })
    .limit(1)
    .single();
  return data;
}

async function getPastSeasons() {
  const { data: seasons } = await supabase
    .from("seasons")
    .select("*")
    .eq("status", "closed")
    .order("end_date", { ascending: false });

  if (!seasons || seasons.length === 0) return [];

  const results = [];

  for (const season of seasons) {
    const { data: winners } = await supabase
      .from("season_results")
      .select("rank, score, quizzes_completed, avg_accuracy, user_id")
      .eq("season_id", season.id)
      .eq("reward_status", "sent")
      .order("rank", { ascending: true })
      .limit(3);

    if (!winners || winners.length === 0) continue;

    const userIds = winners.map(w => w.user_id);
    const { data: users } = await supabase
      .from("users")
      .select("id, username")
      .in("id", userIds);

    const usersById: Record<string, any> = {};
    for (const u of users || []) usersById[u.id] = u;

    results.push({
      season,
      winners: winners.map(w => ({
        ...w,
        username: usersById[w.user_id]?.username || "Unknown",
      })),
    });
  }

  return results;
}

const PRIZE_AMOUNTS: Record<number, string> = { 1: "$20", 2: "$15", 3: "$10" };
const MEDALS = ["👑", "🥈", "🥉"];
const RANK_COLORS = ["var(--neon-yellow)", "#C0C0C0", "#CD7F32"];

export default async function ChampionsPage() {
  const [pastSeasons, currentSeason] = await Promise.all([getPastSeasons(), getCurrentSeason()]);
  const seasonClosed = currentSeason?.status === "closed";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#B84CFF", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Hall of Fame</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 48, marginBottom: 12 }}>🏆 Champions</h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 15, maxWidth: 500, margin: "0 auto" }}>
          The greatest Roblox quiz minds to ever grace the leaderboard. These legends earned real Robux.
        </p>
      </div>

      {seasonClosed ? (
        <div style={{ background: "linear-gradient(135deg, rgba(255,60,172,0.1), rgba(184,76,255,0.08))", border: "1px solid rgba(255,60,172,0.3)", borderRadius: "var(--radius)", padding: "28px 32px", marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "var(--neon-pink)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>⛔ Season 1 — Ended</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 6 }}>Season 1 is officially over!</div>
            <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, lineHeight: 1.6 }}>
              Final standings are locked. Winners have been notified. Season 2 coming soon — stay tuned!
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <a href="/leaderboard" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 24px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
              Final Standings
            </a>
          </div>
        </div>
      ) : (
        <div style={{ background: "linear-gradient(135deg, rgba(184,76,255,0.12), rgba(255,60,172,0.08))", border: "1px solid rgba(184,76,255,0.3)", borderRadius: "var(--radius)", padding: "28px 32px", marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#B84CFF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              {currentSeason?.name || "Season 1"} — In Progress
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 6 }}>Your name could be here</div>
            <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, lineHeight: 1.6 }}>
              Top 3 players win Roblox gift cards up to $20. Season ends {currentSeason?.end_date || "March 31, 2026"}.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <a href="/leaderboard" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 24px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
              View Leaderboard
            </a>
            <a href="/browse" style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 24px", borderRadius: 100, textDecoration: "none", border: "1px solid var(--border)" }}>
              Play Now
            </a>
          </div>
        </div>
      )}

      {pastSeasons.length === 0 ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "60px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 10 }}>No Champions Yet</div>
          <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
            {seasonClosed
              ? "Season 1 just ended! Champions will appear here once prizes are sent."
              : "Season 1 is still running! The first champions will be crowned on April 1, 2026."}
          </p>
          <a href="/leaderboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
            🏆 {seasonClosed ? "View Final Standings" : "See Current Standings"}
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {pastSeasons.map(({ season, winners }) => (
            <div key={season.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg, rgba(184,76,255,0.1), rgba(255,60,172,0.06))", borderBottom: "1px solid var(--border)", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 2 }}>{season.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>{season.start_date + " → " + season.end_date}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 900, padding: "4px 14px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "var(--neon-green)", textTransform: "uppercase", letterSpacing: 1 }}>
                  ✓ Completed
                </span>
              </div>
              <div style={{ padding: "28px 28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {winners.map(w => (
                    <div key={w.rank} style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: "20px 16px", textAlign: "center", border: "1px solid " + RANK_COLORS[w.rank - 1] + "30", position: "relative" }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{MEDALS[w.rank - 1]}</div>
                      <a href={"/profile/" + w.username} style={{ fontFamily: "var(--font-display)", fontSize: 18, color: RANK_COLORS[w.rank - 1], textDecoration: "none", display: "block", marginBottom: 4 }}>
                        {w.username}
                      </a>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "var(--neon-green)", marginBottom: 8 }}>
                        {w.score.toLocaleString() + " pts"}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: "rgba(255,227,71,0.1)", color: "var(--neon-yellow)", display: "inline-block" }}>
                        {PRIZE_AMOUNTS[w.rank] + " Gift Card"}
                      </div>
                      <div style={{ marginTop: 10, fontSize: 10, color: "var(--text-dim)", fontWeight: 600 }}>
                        {w.quizzes_completed + " quizzes · " + w.avg_accuracy + "% accuracy"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 40, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "28px 32px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 8 }}>
          {seasonClosed ? "Season 2 is coming." : "Ready to become a champion?"}
        </div>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
          {seasonClosed
            ? "Keep playing to get ahead before the next season kicks off."
            : "Play quizzes, climb the leaderboard, and win real Roblox gift cards every month."}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/browse" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
            🎮 Start Playing
          </a>
          <a href="/rules" style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", border: "1px solid var(--border)" }}>
            📋 Read the Rules
          </a>
        </div>
      </div>

    </div>
  );
}