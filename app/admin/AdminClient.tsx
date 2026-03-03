"use client";
import { useState } from "react";

const diffColors: Record<string, { color: string, bg: string }> = {
  Easy: { color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" },
  Medium: { color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" },
  Hard: { color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" },
};

const logColors: Record<string, { color: string, bg: string }> = {
  success: { color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" },
  skipped: { color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" },
  failed: { color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" },
};

export default function AdminClient({ quizzes, stats, flags: initialFlags, topQuizzes, cronLogs }: {
  quizzes: any[],
  stats: any,
  flags: any[],
  topQuizzes: any[],
  cronLogs: any[],
}) {
  const [tab, setTab] = useState<"overview" | "quizzes" | "flags" | "logs">("overview");
  const [search, setSearch] = useState("");
  const [gameFilter, setGameFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [flags, setFlags] = useState(initialFlags);
  const [quizList, setQuizList] = useState(quizzes);
  const [dismissing, setDismissing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingFlag, setEditingFlag] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ question: string, answers: string[], correct: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const games = ["All", ...Array.from(new Set(quizList.map(q => q.game)))];

  const filtered = quizList.filter(q => {
    if (gameFilter !== "All" && q.game !== gameFilter) return false;
    if (sourceFilter !== "All" && q.source !== sourceFilter) return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  async function dismissFlag(id: string) {
    setDismissing(id);
    await fetch("/api/flags/dismiss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setFlags(prev => prev.filter(f => f.id !== id));
    setDismissing(null);
    if (editingFlag === id) { setEditingFlag(null); setEditData(null); }
  }

  async function deleteQuiz(slug: string) {
    if (!confirm("Delete quiz: " + slug + "?\nThis cannot be undone.")) return;
    setDeleting(slug);
    await fetch("/api/quiz/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    setQuizList(prev => prev.filter(q => q.slug !== slug));
    setDeleting(null);
  }

  async function startEdit(f: any) {
    if (editingFlag === f.id) { setEditingFlag(null); setEditData(null); return; }
    try {
      const res = await fetch(`/api/quiz/get?slug=${f.quiz_slug}`);
      const data = await res.json();
      const q = data.questions[f.question_index];
      setEditData({ question: q.q, answers: [...q.a], correct: q.correct });
      setEditingFlag(f.id);
    } catch (e) {
      alert("Could not load question data.");
    }
  }

  async function saveEdit(f: any) {
    if (!editData) return;
    setSaving(true);
    const res = await fetch("/api/quiz/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: f.quiz_slug,
        questionIndex: f.question_index,
        question: editData.question,
        answers: editData.answers,
        correct: editData.correct,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setSaveSuccess(f.id);
      setTimeout(() => setSaveSuccess(null), 2000);
    } else {
      alert("Save failed: " + data.error);
    }
  }

  const generatedCount = quizList.filter(q => q.source === "generated").length;
  const staticCount = quizList.filter(q => q.source === "static").length;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 8 }}>{"🛡️ Admin Panel"}</h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>BloxQuiz.gg — Content Management</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Quizzes", value: quizList.length, color: "var(--neon-blue)" },
          { label: "Generated", value: generatedCount, color: "#B84CFF" },
          { label: "Total Plays", value: stats.totalPlays, color: "var(--neon-green)" },
          { label: "Total Users", value: stats.totalUsers, color: "var(--neon-blue)" },
          { label: "Open Flags", value: flags.length, color: "var(--neon-yellow)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {(["overview", "quizzes", "flags", "logs"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "8px 20px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: tab === t ? "var(--gradient-main)" : "var(--surface)", color: tab === t ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: tab === t ? "var(--bg)" : "var(--text-muted)", textTransform: "capitalize" }}>
            {t === "flags" && flags.length > 0 ? `flags (${flags.length})` : t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
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

      {/* Quizzes Tab */}
      {tab === "quizzes" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <input type="text" placeholder="🔍 Search quizzes..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: "10px 20px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 100, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", minWidth: 260 }} />
            <div style={{ display: "flex", gap: 6 }}>
              {["All", "static", "generated"].map(s => (
                <button key={s} onClick={() => setSourceFilter(s)}
                  style={{ padding: "8px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, background: sourceFilter === s ? "#B84CFF" : "var(--surface)", color: sourceFilter === s ? "#fff" : "var(--text-muted)", WebkitTextFillColor: sourceFilter === s ? "#fff" : "var(--text-muted)", textTransform: "capitalize" }}>
                  {s === "static" ? `📁 Static (${staticCount})` : s === "generated" ? `🤖 Generated (${generatedCount})` : "All"}
                </button>
              ))}
            </div>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 90px 50px 80px 120px", padding: "10px 20px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>
              <div>Title</div><div>Game</div><div>Difficulty</div><div>Qs</div><div>Source</div><div>Actions</div>
            </div>
            {filtered.map((quiz, i) => {
              const diff = diffColors[quiz.difficulty] || diffColors.Medium;
              return (
                <div key={quiz.slug} style={{ display: "grid", gridTemplateColumns: "1fr 120px 90px 50px 80px 120px", alignItems: "center", padding: "12px 20px", borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{quiz.title}</div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{quiz.slug}</div>
                    {quiz.angle && <div style={{ fontSize: 10, color: "#B84CFF", fontWeight: 700, marginTop: 2 }}>{quiz.angle}</div>}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>{quiz.game}</div>
                  <div><span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 100, background: diff.bg, color: diff.color }}>{quiz.difficulty}</span></div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>{quiz.questions}</div>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 100, background: quiz.source === "generated" ? "rgba(184,76,255,0.15)" : "rgba(0,217,255,0.1)", color: quiz.source === "generated" ? "#B84CFF" : "var(--neon-blue)" }}>
                      {quiz.source === "generated" ? "🤖 AI" : "📁 Static"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <a href={"/quiz/" + quiz.slug} target="_blank"
                      style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 100, background: "rgba(0,217,255,0.1)", color: "var(--neon-blue)", textDecoration: "none" }}>
                      View
                    </a>
                    {quiz.source === "generated" && (
                      <button onClick={() => deleteQuiz(quiz.slug)} disabled={deleting === quiz.slug}
                        style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 100, background: "rgba(255,60,172,0.1)", color: "var(--neon-pink)", border: "none", cursor: "pointer" }}>
                        {deleting === quiz.slug ? "..." : "🗑️"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>{"Showing " + filtered.length + " of " + quizList.length + " quizzes"}</div>
        </div>
      )}

      {/* Flags Tab */}
      {tab === "flags" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {flags.length === 0 ? (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 40, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>
              No open flags! 🎉
            </div>
          ) : (
            flags.map((f) => (
              <div key={f.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr 100px auto", alignItems: "center", padding: "14px 20px", gap: 12 }}>
                  <div>
                    <a href={"/quiz/" + f.quiz_slug} target="_blank" style={{ fontSize: 13, fontWeight: 700, color: "var(--neon-blue)", textDecoration: "none" }}>{f.quiz_slug}</a>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>{"Q" + (f.question_index + 1)}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{f.reason || "No reason given"}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{new Date(f.created_at).toLocaleDateString()}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => startEdit(f)}
                      style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: editingFlag === f.id ? "rgba(255,227,71,0.15)" : "rgba(0,217,255,0.1)", color: editingFlag === f.id ? "var(--neon-yellow)" : "var(--neon-blue)", border: "none", cursor: "pointer" }}>
                      {editingFlag === f.id ? "Close" : "✏️ Edit"}
                    </button>
                    <button onClick={() => dismissFlag(f.id)} disabled={dismissing === f.id}
                      style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "var(--neon-green)", border: "none", cursor: "pointer" }}>
                      {dismissing === f.id ? "..." : "✅ Dismiss"}
                    </button>
                  </div>
                </div>

                {editingFlag === f.id && editData && (
                  <div style={{ borderTop: "1px solid var(--border)", padding: 20, background: "var(--surface)" }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Edit Question</div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Question</label>
                      <textarea value={editData.question} onChange={e => setEditData({ ...editData, question: e.target.value })} rows={2}
                        style={{ width: "100%", padding: "10px 14px", background: "var(--bg-card)", border: "1.5px solid var(--border)", borderRadius: 10, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, resize: "vertical", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Answer Options</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {editData.answers.map((ans, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <button onClick={() => setEditData({ ...editData, correct: j })}
                              style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid " + (editData.correct === j ? "var(--neon-green)" : "var(--border)"), background: editData.correct === j ? "rgba(0,245,160,0.15)" : "var(--bg-card)", color: editData.correct === j ? "var(--neon-green)" : "var(--text-dim)", fontSize: 12, fontWeight: 900, cursor: "pointer", flexShrink: 0 }}>
                              {["A", "B", "C", "D"][j]}
                            </button>
                            <input value={ans} onChange={e => { const a = [...editData.answers]; a[j] = e.target.value; setEditData({ ...editData, answers: a }); }}
                              style={{ flex: 1, padding: "8px 14px", background: "var(--bg-card)", border: "1.5px solid " + (editData.correct === j ? "var(--neon-green)" : "var(--border)"), borderRadius: 8, color: "var(--text)", fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 600 }} />
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600, marginTop: 8 }}>Click a letter to set the correct answer</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => saveEdit(f)} disabled={saving}
                        style={{ padding: "10px 24px", borderRadius: 100, border: "none", background: saveSuccess === f.id ? "rgba(0,245,160,0.2)" : "var(--gradient-main)", color: saveSuccess === f.id ? "var(--neon-green)" : "var(--bg)", fontWeight: 900, fontSize: 13, cursor: saving ? "default" : "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: saveSuccess === f.id ? "var(--neon-green)" : "var(--bg)" }}>
                        {saving ? "Saving..." : saveSuccess === f.id ? "✅ Saved!" : "Save Changes"}
                      </button>
                      <button onClick={() => dismissFlag(f.id)} disabled={dismissing === f.id}
                        style={{ padding: "10px 24px", borderRadius: 100, border: "none", background: "rgba(0,245,160,0.1)", color: "var(--neon-green)", fontWeight: 900, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                        Save & Dismiss
                      </button>
                      <button onClick={() => { setEditingFlag(null); setEditData(null); }}
                        style={{ padding: "10px 24px", borderRadius: 100, border: "1px solid var(--border)", background: "none", color: "var(--text-muted)", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Logs Tab */}
      {tab === "logs" && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          {cronLogs.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>No cron logs yet — set up cron-job.org to start generating!</div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "80px 120px 100px 1fr 140px", padding: "10px 20px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>
                <div>Status</div><div>Game</div><div>Angle</div><div>Quiz / Error</div><div>Date</div>
              </div>
              {cronLogs.map((log, i) => {
                const lc = logColors[log.status] || logColors.skipped;
                return (
                  <div key={log.id} style={{ display: "grid", gridTemplateColumns: "80px 120px 100px 1fr 140px", alignItems: "center", padding: "12px 20px", borderBottom: i < cronLogs.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 100, background: lc.bg, color: lc.color, textTransform: "uppercase" }}>{log.status}</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>{log.game || "—"}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>{log.angle || "—"}</div>
                    <div style={{ fontSize: 12, color: log.error ? "var(--neon-pink)" : "var(--text-muted)", fontWeight: 600 }}>
                      {log.quiz_slug ? (
                        <a href={"/quiz/" + log.quiz_slug} target="_blank" style={{ color: "var(--neon-blue)", textDecoration: "none", fontWeight: 700 }}>{log.quiz_slug}</a>
                      ) : log.error || "—"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{new Date(log.created_at).toLocaleString()}</div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}