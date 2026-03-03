"use client";
import { useState } from "react";

const diffColors: Record<string, { color: string, bg: string }> = {
  Easy: { color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" },
  Medium: { color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" },
  Hard: { color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" },
};

export default function AdminClient({ quizzes, stats, flags: initialFlags, topQuizzes }: {
  quizzes: any[],
  stats: any,
  flags: any[],
  topQuizzes: any[],
}) {
  const [tab, setTab] = useState<"overview" | "quizzes" | "flags">("overview");
  const [search, setSearch] = useState("");
  const [gameFilter, setGameFilter] = useState("All");
  const [flags, setFlags] = useState(initialFlags);
  const [dismissing, setDismissing] = useState<string | null>(null);

  const games = ["All", ...Array.from(new Set(quizzes.map(q => q.game)))];

  const filtered = quizzes.filter(q => {
    if (gameFilter !== "All" && q.game !== gameFilter) return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  async function dismissFlag(id: string) {
    console.log("Dismissing flag id:", id);
    setDismissing(id);
    const res = await fetch("/api/flags/dismiss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    console.log("Response:", data);
    setFlags(prev => prev.filter(f => f.id !== id));
    setDismissing(null);
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 8 }}>{"🛡️ Admin Panel"}</h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>BloxQuiz.gg — Content Management</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Quizzes", value: quizzes.length, color: "var(--neon-blue)" },
          { label: "Total Plays", value: stats.totalPlays, color: "var(--neon-green)" },
          { label: "Total Users", value: stats.totalUsers, color: "#B84CFF" },
          { label: "Open Flags", value: flags.length, color: "var(--neon-yellow)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {(["overview", "quizzes", "flags"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "8px 20px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: tab === t ? "var(--gradient-main)" : "var(--surface)", color: tab === t ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: tab === t ? "var(--bg)" : "var(--text-muted)", textTransform: "capitalize" }}>
            {t}{t === "flags" && flags.length > 0 ? " (" + flags.length + ")" : ""}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 16 }}>{"🔥 Most Played Quizzes"}</h2>
            {topQuizzes.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>No play data yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {topQuizzes.map((q, i) => (
                  <div key={q.slug} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--surface)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: i === 0 ? "var(--neon-yellow)" : "var(--text-dim)", minWidth: 24 }}>{i + 1}</span>
                      <a href={"/quiz/" + q.slug} target="_blank" style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", textDecoration: "none" }}>
                        {q.slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()).substring(0, 40)}
                      </a>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "var(--neon-green)" }}>{q.plays + " plays"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 16 }}>{"🚩 Recent Flags"}</h2>
            {flags.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>No open flags! 🎉</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {flags.slice(0, 8).map((f) => (
                  <div key={f.id} style={{ padding: "10px 14px", background: "var(--surface)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{f.quiz_slug}</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{"Q" + (f.question_index + 1) + " — " + (f.reason || "No reason given")}</div>
                      <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>{new Date(f.created_at).toLocaleDateString()}</div>
                    </div>
                    <button onClick={() => dismissFlag(f.id)} disabled={dismissing === f.id}
                      style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "var(--neon-green)", border: "none", cursor: "pointer", flexShrink: 0 }}>
                      {dismissing === f.id ? "..." : "Dismiss"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "quizzes" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <input type="text" placeholder="🔍 Search quizzes..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: "10px 20px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 100, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", minWidth: 260 }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {games.map(g => (
              <button key={g} onClick={() => setGameFilter(g)}
                style={{ padding: "5px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 11, background: gameFilter === g ? "var(--gradient-main)" : "var(--surface)", color: gameFilter === g ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: gameFilter === g ? "var(--bg)" : "var(--text-muted)" }}>
                {g}
              </button>
            ))}
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 90px 60px 100px", padding: "10px 20px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>
              <div>Title</div><div>Game</div><div>Difficulty</div><div>Qs</div><div>Actions</div>
            </div>
            {filtered.map((quiz, i) => {
              const diff = diffColors[quiz.difficulty] || diffColors.Medium;
              return (
                <div key={quiz.slug} style={{ display: "grid", gridTemplateColumns: "1fr 140px 90px 60px 100px", alignItems: "center", padding: "12px 20px", borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{quiz.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{quiz.slug}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>{quiz.game}</div>
                  <div><span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 100, background: diff.bg, color: diff.color }}>{quiz.difficulty}</span></div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>{quiz.questions}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <a href={"/quiz/" + quiz.slug} target="_blank"
                      style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 100, background: "rgba(0,217,255,0.1)", color: "var(--neon-blue)", textDecoration: "none" }}>
                      View
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>{"Showing " + filtered.length + " of " + quizzes.length + " quizzes"}</div>
        </div>
      )}

      {tab === "flags" && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          {flags.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>No open flags! 🎉</div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr 100px 90px", padding: "10px 20px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>
                <div>Quiz</div><div>Q#</div><div>Reason</div><div>Date</div><div>Action</div>
              </div>
              {flags.map((f, i) => (
                <div key={f.id} style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr 100px 90px", alignItems: "center", padding: "14px 20px", borderBottom: i < flags.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div>
                    <a href={"/quiz/" + f.quiz_slug} target="_blank" style={{ fontSize: 13, fontWeight: 700, color: "var(--neon-blue)", textDecoration: "none" }}>{f.quiz_slug}</a>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>{"Q" + (f.question_index + 1)}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{f.reason || "No reason given"}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{new Date(f.created_at).toLocaleDateString()}</div>
                  <div>
                    <button onClick={() => dismissFlag(f.id)} disabled={dismissing === f.id}
                      style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "var(--neon-green)", border: "none", cursor: "pointer" }}>
                      {dismissing === f.id ? "..." : "✅ Dismiss"}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}