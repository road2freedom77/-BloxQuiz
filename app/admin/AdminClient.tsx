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

const rewardStatusColors: Record<string, { color: string, bg: string }> = {
  pending: { color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" },
  claimed: { color: "var(--neon-blue)", bg: "rgba(0,217,255,0.1)" },
  sent: { color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" },
  expired: { color: "var(--text-dim)", bg: "var(--surface)" },
  disqualified: { color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" },
};

const claimStatusColors: Record<string, { color: string, bg: string }> = {
  pending: { color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" },
  sent: { color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" },
  rejected: { color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" },
};

const PRIZE_AMOUNTS: Record<number, string> = { 1: "$20", 2: "$15", 3: "$10" };

const GAME_SLUGS: Record<string, string> = {
  "Blox Fruits": "blox-fruits",
  "Brookhaven RP": "brookhaven-rp",
  "Adopt Me!": "adopt-me",
  "Tower of Hell": "tower-of-hell",
  "Murder Mystery 2": "murder-mystery-2",
  "Grow a Garden": "grow-a-garden",
  "Royale High": "royale-high",
  "Doors": "doors",
  "Arsenal": "arsenal",
  "Anime Fighting Simulator": "anime-fighting-simulator",
  "Berry Avenue": "berry-avenue",
  "Livetopia": "livetopia",
  "Natural Disaster Survival": "natural-disaster-survival",
  "Anime Defenders": "anime-defenders",
  "Funky Friday": "funky-friday",
  "Kick Off": "kick-off",
  "Bee Swarm Simulator": "bee-swarm-simulator",
  "Dress to Impress": "dress-to-impress",
  "Fisch": "fisch",
};

const ANGLES = [
  "Beginner", "Expert", "Lore", "Trading", "Mechanics", "Secrets", "Updates", "Characters",
  "Locations", "Roleplay", "Pets", "Stages", "Tips", "Modifiers", "Plants", "Mutations",
  "Strategy", "Fashion", "Entities", "Survival", "Weapons", "Maps", "Training", "Jobs",
  "Disasters", "Songs", "Ranks", "Teams", "Skills", "Bees", "Themes", "Fishing",
];

const DISQUALIFY_REASONS = [
  "Bot activity",
  "Multiple accounts",
  "Impossible speed",
  "Manual review",
  "Other",
];

const inputStyle = { width: "100%", padding: "10px 14px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 10, color: "var(--text)", fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 600, boxSizing: "border-box" as const };
const labelStyle = { fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase" as const, letterSpacing: 1, display: "block" as const, marginBottom: 6 };

function SubmitQuizTab() {
  const GAMES_LIST = [
    "Blox Fruits", "Brookhaven RP", "Adopt Me!", "Tower of Hell", "Murder Mystery 2",
    "Grow a Garden", "Royale High", "Doors", "Arsenal", "Anime Fighting Simulator",
    "Berry Avenue", "Livetopia", "Natural Disaster Survival", "Anime Defenders",
    "Funky Friday", "Kick Off", "Bee Swarm Simulator", "Dress to Impress", "Fisch",
  ];
  const ANGLES_LIST = [
    "Beginner", "Expert", "Lore", "Trading", "Mechanics", "Secrets", "Updates", "Characters",
    "Locations", "Roleplay", "Pets", "Stages", "Tips", "Modifiers", "Plants", "Mutations",
    "Strategy", "Fashion", "Entities", "Survival", "Weapons", "Maps", "Training", "Jobs",
    "Disasters", "Songs", "Ranks", "Teams", "Skills", "Bees", "Themes", "Fishing",
  ];

  const emptyQuestion = () => ({ q: "", a: ["", "", "", ""], correct: 0 });
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [game, setGame] = useState(GAMES_LIST[0]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [angle, setAngle] = useState("");
  const [questions, setQuestions] = useState(Array.from({ length: 10 }, emptyQuestion));
  const [faqs, setFaqs] = useState([
    { question: "", answer: "" }, { question: "", answer: "" },
    { question: "", answer: "" }, { question: "", answer: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function updateQuestion(i: number, field: string, value: any) {
    setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  }
  function updateAnswer(qi: number, ai: number, value: string) {
    setQuestions(prev => prev.map((q, idx) => idx === qi ? { ...q, a: q.a.map((a: string, j: number) => j === ai ? value : a) } : q));
  }
  function updateFaq(i: number, field: string, value: string) {
    setFaqs(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f));
  }

  async function handleSubmit() {
    if (!title.trim()) { setError("Title is required."); return; }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.q.trim()) { setError("Question " + (i + 1) + " is empty."); return; }
      for (let j = 0; j < 4; j++) {
        if (!q.a[j].trim()) { setError("Question " + (i + 1) + ", Answer " + ["A","B","C","D"][j] + " is empty."); return; }
      }
    }
    setSubmitting(true); setError(null); setSuccess(null);
    const slug = slugify(title);
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, intro, game, difficulty, angle: angle || null, questions, faqs, source: "admin" }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      setSuccess("✅ Quiz published! " + slug);
      setTitle(""); setIntro(""); setAngle("");
      setQuestions(Array.from({ length: 10 }, emptyQuestion));
      setFaqs([{ question: "", answer: "" }, { question: "", answer: "" }, { question: "", answer: "" }, { question: "", answer: "" }]);
    } else { setError("Failed: " + data.error); }
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 24 }}>✍️ Submit Admin Quiz</h2>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Quiz Details</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={labelStyle}>Title</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Blox Fruits: Ultimate Devil Fruit Quiz" style={inputStyle} /></div>
          <div><label style={labelStyle}>Intro (2-3 sentences, fan tone)</label><textarea value={intro} onChange={e => setIntro(e.target.value)} rows={3} placeholder="Write a hype intro for this quiz..." style={{ ...inputStyle, resize: "vertical" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div><label style={labelStyle}>Game</label><select value={game} onChange={e => setGame(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>{GAMES_LIST.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
            <div><label style={labelStyle}>Difficulty</label><select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>{["Easy", "Medium", "Hard"].map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div><label style={labelStyle}>Angle</label><select value={angle} onChange={e => setAngle(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}><option value="">— unset —</option>{ANGLES_LIST.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
        {questions.map((q, i) => (
          <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#B84CFF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Question {i + 1}</div>
            <div style={{ marginBottom: 12 }}><input value={q.q} onChange={e => updateQuestion(i, "q", e.target.value)} placeholder={"Question " + (i + 1) + "..."} style={inputStyle} /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.a.map((ans: string, j: number) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => updateQuestion(i, "correct", j)} style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid " + (q.correct === j ? "var(--neon-green)" : "var(--border)"), background: q.correct === j ? "rgba(0,245,160,0.15)" : "var(--surface)", color: q.correct === j ? "var(--neon-green)" : "var(--text-dim)", fontSize: 12, fontWeight: 900, cursor: "pointer", flexShrink: 0 }}>{["A","B","C","D"][j]}</button>
                  <input value={ans} onChange={e => updateAnswer(i, j, e.target.value)} placeholder={"Answer " + ["A","B","C","D"][j] + "..."} style={{ ...inputStyle, border: "1.5px solid " + (q.correct === j ? "var(--neon-green)" : "var(--border)") }} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600, marginTop: 8 }}>Click a letter to mark the correct answer</p>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>FAQs (4 required)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input value={faq.question} onChange={e => updateFaq(i, "question", e.target.value)} placeholder={"FAQ " + (i + 1) + " question..."} style={inputStyle} />
              <textarea value={faq.answer} onChange={e => updateFaq(i, "answer", e.target.value)} placeholder="Answer..." rows={2} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          ))}
        </div>
      </div>
      {error && <div style={{ padding: "12px 16px", background: "rgba(255,60,172,0.1)", border: "1px solid rgba(255,60,172,0.3)", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "var(--neon-pink)", marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ padding: "12px 16px", background: "rgba(0,245,160,0.1)", border: "1px solid rgba(0,245,160,0.3)", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "var(--neon-green)", marginBottom: 16 }}>{success}</div>}
      <button onClick={handleSubmit} disabled={submitting} style={{ padding: "14px 40px", borderRadius: 100, border: "none", background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 15, cursor: submitting ? "default" : "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: "var(--bg)", opacity: submitting ? 0.7 : 1 }}>
        {submitting ? "⏳ Publishing..." : "🚀 Publish Quiz"}
      </button>
    </div>
  );
}

function siloStrength(count: number): { label: string, color: string, bg: string } {
  if (count >= 15) return { label: "🏆 Strong", color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" };
  if (count >= 8) return { label: "📈 Growing", color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" };
  if (count >= 4) return { label: "⚠️ Weak", color: "#FF8A47", bg: "rgba(255,138,71,0.1)" };
  return { label: "🔴 Thin", color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" };
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminClient({
  quizzes,
  stats,
  flags: initialFlags,
  topQuizzes,
  cronLogs,
  seasonStandings,
  flaggedUsers,
  season,
  prizeClaims: initialClaims,
}: {
  quizzes: any[],
  stats: any,
  flags: any[],
  topQuizzes: any[],
  cronLogs: any[],
  seasonStandings: any[],
  flaggedUsers: any[],
  season: any,
  prizeClaims: any[],
}) {
  const [tab, setTab] = useState<"overview" | "silos" | "quizzes" | "flags" | "logs" | "seasons" | "submit">("overview");
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
  const [standings, setStandings] = useState(seasonStandings || []);
  const [seasonTab, setSeasonTab] = useState<"standings" | "flagged" | "claims" | "close">("standings");
  const [disqualifying, setDisqualifying] = useState<string | null>(null);
  const [disqualifyReason, setDisqualifyReason] = useState<Record<string, string>>({});
  const [closingSeason, setClosingSeason] = useState(false);
  const [seasonClosed, setSeasonClosed] = useState(season?.status === "closed");
  const [updatingReward, setUpdatingReward] = useState<string | null>(null);
  const [claims, setClaims] = useState(initialClaims || []);
  const [updatingClaim, setUpdatingClaim] = useState<string | null>(null);
  const [updatingAngle, setUpdatingAngle] = useState<string | null>(null);
  const [quizPage, setQuizPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"none" | "difficulty" | "angle" | "title_asc" | "title_desc" | "date_desc" | "date_asc">("none");
  const [angleFilter, setAngleFilter] = useState("All");
  const QUIZ_PAGE_SIZE = 30;
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [notifyingWinners, setNotifyingWinners] = useState(false);
  const [notifyResult, setNotifyResult] = useState<{ sent: string[], failed: string[] } | null>(null);

  // Draft/edit state
  const [editingQuiz, setEditingQuiz] = useState<string | null>(null);
  const [quizEditData, setQuizEditData] = useState<{ questions: any[], loadError?: string } | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState<string | null>(null);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [quizSaveSuccess, setQuizSaveSuccess] = useState<string | null>(null);

  const games = ["All", ...Array.from(new Set(quizList.map(q => q.game)))];
  const difficultyOrder: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };

  let filtered = quizList.filter(q => {
    if (gameFilter !== "All" && q.game !== gameFilter) return false;
    if (sourceFilter !== "All" && q.source !== sourceFilter) return false;
    if (statusFilter === "Draft" && q.status !== "draft") return false;
    if (statusFilter === "Published" && q.status === "draft") return false;
    if (angleFilter !== "All") {
      if (angleFilter === "Unassigned" && q.angle) return false;
      if (angleFilter !== "Unassigned" && q.angle !== angleFilter) return false;
    }
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (sortBy === "difficulty") filtered = [...filtered].sort((a, b) => (difficultyOrder[a.difficulty] ?? 99) - (difficultyOrder[b.difficulty] ?? 99));
  else if (sortBy === "angle") filtered = [...filtered].sort((a, b) => { if (!a.angle && !b.angle) return 0; if (!a.angle) return 1; if (!b.angle) return -1; return a.angle.localeCompare(b.angle); });
  else if (sortBy === "title_asc") filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === "title_desc") filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
  else if (sortBy === "date_desc") filtered = [...filtered].sort((a, b) => {
    if (!a.published_at && !b.published_at) return 0;
    if (!a.published_at) return 1;
    if (!b.published_at) return -1;
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });
  else if (sortBy === "date_asc") filtered = [...filtered].sort((a, b) => {
    if (!a.published_at && !b.published_at) return 0;
    if (!a.published_at) return 1;
    if (!b.published_at) return -1;
    return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
  });

  const quizTotalPages = Math.ceil(filtered.length / QUIZ_PAGE_SIZE);
  const paginatedQuizzes = filtered.slice((quizPage - 1) * QUIZ_PAGE_SIZE, quizPage * QUIZ_PAGE_SIZE);

  const siloData = Object.keys(GAME_SLUGS).map(game => {
    const gameQuizzes = quizList.filter(q => q.game === game);
    const angleBreakdown: Record<string, number> = {};
    for (const angle of ANGLES) angleBreakdown[angle] = gameQuizzes.filter(q => q.angle === angle).length;
    const uncategorized = gameQuizzes.filter(q => !q.angle || !ANGLES.includes(q.angle)).length;
    const strength = siloStrength(gameQuizzes.length);
    return { game, slug: GAME_SLUGS[game], count: gameQuizzes.length, angleBreakdown, uncategorized, strength };
  }).sort((a, b) => b.count - a.count);

  const strongCount = siloData.filter(s => s.count >= 15).length;
  const growingCount = siloData.filter(s => s.count >= 8 && s.count < 15).length;
  const weakCount = siloData.filter(s => s.count < 8).length;
  const generatedCount = quizList.filter(q => q.source === "generated").length;
  const adminCount = quizList.filter(q => q.source === "admin").length;
  const draftCount = quizList.filter(q => q.status === "draft").length;
  const staticCount = quizList.filter(q => q.source === "static").length;
  const qualifiedStandings = standings.filter((p: any) => p.quizzes_completed >= 10 && !p.disqualified);
  const pendingClaims = claims.filter((c: any) => c.status === "pending").length;

  async function dismissFlag(id: string) {
    setDismissing(id);
    await fetch("/api/flags/dismiss", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setFlags((prev: any[]) => prev.filter(f => f.id !== id));
    setDismissing(null);
    if (editingFlag === id) { setEditingFlag(null); setEditData(null); }
  }

  async function deleteQuiz(slug: string) {
    if (!confirm("Delete quiz: " + slug + "?\nThis cannot be undone.")) return;
    setDeleting(slug);
    await fetch("/api/quiz/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
    setQuizList((prev: any[]) => prev.filter(q => q.slug !== slug));
    setDeleting(null);
  }

  async function publishQuiz(slug: string) {
    try {
      const res = await fetch("/api/quiz/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
      const data = await res.json();
      if (data.success) setQuizList(prev => prev.map(q => q.slug === slug ? { ...q, status: "published", published_at: new Date().toISOString() } : q));
    } catch (e) { console.error("Publish failed", e); }
  }

  async function updateAngle(slug: string, angle: string) {
    setUpdatingAngle(slug);
    await fetch("/api/quiz/update-angle", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, angle }) });
    setQuizList((prev: any[]) => prev.map(q => q.slug === slug ? { ...q, angle } : q));
    setUpdatingAngle(null);
  }

  async function startEdit(f: any) {
    if (editingFlag === f.id) { setEditingFlag(null); setEditData(null); return; }
    try {
      const res = await fetch("/api/quiz/get?slug=" + f.quiz_slug);
      const data = await res.json();
      const q = data.questions[f.question_index];
      setEditData({ question: q.q, answers: [...q.a], correct: q.correct });
      setEditingFlag(f.id);
    } catch (e) { alert("Could not load question data."); }
  }

  async function saveEdit(f: any) {
    if (!editData) return;
    setSaving(true);
    const res = await fetch("/api/quiz/edit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: f.quiz_slug, questionIndex: f.question_index, question: editData.question, answers: editData.answers, correct: editData.correct }) });
    const data = await res.json();
    setSaving(false);
    if (data.success) { setSaveSuccess(f.id); setTimeout(() => setSaveSuccess(null), 2000); }
    else alert("Save failed: " + data.error);
  }

  // Quiz edit functions (works for both drafts and published)
  async function loadQuizForEdit(slug: string) {
    if (editingQuiz === slug) { setEditingQuiz(null); setQuizEditData(null); return; }
    setLoadingQuiz(slug);
    try {
      const res = await fetch("/api/quiz/get?slug=" + slug);
      const data = await res.json();
      if (!data.questions) throw new Error("No questions found");
      setQuizEditData({ questions: data.questions.map((q: any) => ({ q: q.q, a: [...q.a], correct: q.correct })) });
      setEditingQuiz(slug);
    } catch (e) {
      setQuizEditData({ questions: [], loadError: "Failed to load quiz data." });
      setEditingQuiz(slug);
    }
    setLoadingQuiz(null);
  }

  function updateQuizQuestion(qi: number, field: string, value: any) {
    if (!quizEditData) return;
    setQuizEditData(prev => ({
      ...prev!,
      questions: prev!.questions.map((q, i) => i === qi ? { ...q, [field]: value } : q),
    }));
  }

  function updateQuizAnswer(qi: number, ai: number, value: string) {
    if (!quizEditData) return;
    setQuizEditData(prev => ({
      ...prev!,
      questions: prev!.questions.map((q, i) => i === qi ? { ...q, a: q.a.map((a: string, j: number) => j === ai ? value : a) } : q),
    }));
  }

  async function saveQuizEdit(slug: string, andPublish: boolean) {
    if (!quizEditData) return;
    setSavingQuiz(true);
    try {
      const res = await fetch("/api/quiz/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, questions: quizEditData.questions, publish: andPublish }),
      });
      const data = await res.json();
      if (data.success) {
        if (andPublish) {
          setQuizList(prev => prev.map(q => q.slug === slug ? { ...q, status: "published", published_at: new Date().toISOString() } : q));
          setEditingQuiz(null);
          setQuizEditData(null);
        } else {
          setQuizSaveSuccess(slug);
          setTimeout(() => setQuizSaveSuccess(null), 2000);
        }
      } else {
        alert("Save failed: " + data.error);
      }
    } catch (e) {
      alert("Save failed.");
    }
    setSavingQuiz(false);
  }

  async function disqualifyUser(userId: string) {
    const reason = disqualifyReason[userId];
    if (!reason) { alert("Select a reason first."); return; }
    if (!confirm("Disqualify this user for: " + reason + "?")) return;
    setDisqualifying(userId);
    await fetch("/api/season/disqualify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, reason, seasonId: season?.id }) });
    setStandings((prev: any[]) => prev.map(p => p.user_id === userId ? { ...p, is_flagged: true, disqualified: true } : p));
    setDisqualifying(null);
  }

  async function updateRewardStatus(userId: string, status: string) {
    setUpdatingReward(userId);
    await fetch("/api/season/reward", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, status, seasonId: season?.id }) });
    setStandings((prev: any[]) => prev.map(p => p.user_id === userId ? { ...p, reward_status: status } : p));
    setUpdatingReward(null);
  }

  async function updateClaimStatus(claimId: string, status: string) {
    setUpdatingClaim(claimId);
    await fetch("/api/rewards/update-claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ claimId, status }) });
    setClaims((prev: any[]) => prev.map(c => c.id === claimId ? { ...c, status } : c));
    setUpdatingClaim(null);
  }

  async function closeSeason() {
    if (!confirm("Close Season 1 and snapshot final results? This cannot be undone.")) return;
    setClosingSeason(true);
    await fetch("/api/season/close", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seasonId: season?.id }) });
    setClosingSeason(false);
    setSeasonClosed(true);
  }

  async function notifyWinners() {
    if (!confirm("Send prize notification emails to all pending winners?")) return;
    setNotifyingWinners(true);
    const res = await fetch("/api/notify-winners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seasonId: season?.id }) });
    const data = await res.json();
    setNotifyingWinners(false);
    setNotifyResult({ sent: data.sent || [], failed: data.failed || [] });
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedEmail(id);
    setTimeout(() => setCopiedEmail(null), 2000);
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, marginBottom: 8 }}>🛡️ Admin Panel</h1>
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
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {(["overview", "seasons", "silos", "quizzes", "flags", "logs", "submit"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "8px 20px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: tab === t ? "var(--gradient-main)" : "var(--surface)", color: tab === t ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: tab === t ? "var(--bg)" : "var(--text-muted)", textTransform: "capitalize" }}>
            {t === "flags" && flags.length > 0 ? "flags (" + flags.length + ")" : t === "seasons" ? "🏆 Seasons" : t === "submit" ? "✍️ Submit Quiz" : t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 16 }}>🔥 Most Played Quizzes</h2>
            {topQuizzes.length === 0 ? <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>No play data yet.</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {topQuizzes.map((q, i) => (
                  <div key={q.slug} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--surface)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: i === 0 ? "var(--neon-yellow)" : "var(--text-dim)", minWidth: 24 }}>{i + 1}</span>
                      <a href={"/quiz/" + q.slug} target="_blank" style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", textDecoration: "none" }}>{q.slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()).substring(0, 40)}</a>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "var(--neon-green)" }}>{q.plays + " plays"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 16 }}>🚩 Recent Flags</h2>
            {flags.length === 0 ? <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>No open flags! 🎉</p> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {flags.slice(0, 8).map((f: any) => (
                  <div key={f.id} style={{ padding: "10px 14px", background: "var(--surface)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{f.quiz_slug}</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{"Q" + (f.question_index + 1) + " — " + (f.reason || "No reason given")}</div>
                      <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 2 }}>{new Date(f.created_at).toLocaleDateString()}</div>
                    </div>
                    <button onClick={() => dismissFlag(f.id)} disabled={dismissing === f.id} style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "var(--neon-green)", border: "none", cursor: "pointer", flexShrink: 0 }}>
                      {dismissing === f.id ? "..." : "Dismiss"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Seasons Tab */}
      {tab === "seasons" && (
        <div>
          <div style={{ background: "linear-gradient(135deg, rgba(184,76,255,0.12), rgba(255,60,172,0.08))", border: "1px solid rgba(184,76,255,0.3)", borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#B84CFF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Current Season</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 4 }}>{season?.name || "Season 1"}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{season?.start_date + " → " + season?.end_date}</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 800, padding: "6px 16px", borderRadius: 100, background: seasonClosed ? "rgba(255,60,172,0.1)" : "rgba(0,245,160,0.1)", color: seasonClosed ? "var(--neon-pink)" : "var(--neon-green)" }}>{seasonClosed ? "⛔ Closed" : "🟢 Active"}</span>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>{standings.length + " players • " + qualifiedStandings.length + " qualifying"}</div>
            </div>
          </div>

          {seasonClosed && qualifiedStandings.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>🏆 Final Winners</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 }}>
                {[0, 1, 2].map(i => {
                  const player = qualifiedStandings[i];
                  const medals = ["👑", "🥈", "🥉"];
                  const colors = ["var(--neon-yellow)", "#C0C0C0", "#CD7F32"];
                  const prizes = ["$20", "$15", "$10"];
                  const borders = ["rgba(255,227,71,0.3)", "rgba(192,192,192,0.3)", "rgba(205,127,50,0.3)"];
                  const bgs = ["rgba(255,227,71,0.06)", "rgba(192,192,192,0.06)", "rgba(205,127,50,0.06)"];
                  if (!player) return (
                    <div key={i} style={{ background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: "var(--radius)", padding: "20px", textAlign: "center" }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{medals[i]}</div>
                      <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>No qualifying player</div>
                    </div>
                  );
                  const rs = rewardStatusColors[player.reward_status || "pending"];
                  return (
                    <div key={player.user_id} style={{ background: bgs[i], border: "1px solid " + borders[i], borderRadius: "var(--radius)", padding: "20px 22px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <span style={{ fontSize: 28 }}>{medals[i]}</span>
                        <div>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: colors[i], marginBottom: 1 }}>{"#" + (i + 1) + " Place"}</div>
                          <a href={"/profile/" + player.username} target="_blank" style={{ fontWeight: 900, fontSize: 16, color: "var(--text)", textDecoration: "none" }}>{player.username}</a>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700 }}><span style={{ color: "var(--text-dim)" }}>Score</span><span style={{ color: "var(--neon-green)", fontFamily: "var(--font-display)" }}>{(player.monthly_score || 0).toLocaleString()}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700 }}><span style={{ color: "var(--text-dim)" }}>Quizzes</span><span style={{ color: "var(--text-muted)" }}>{player.quizzes_completed}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700 }}><span style={{ color: "var(--text-dim)" }}>Accuracy</span><span style={{ color: "var(--text-muted)" }}>{player.avg_accuracy}%</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, fontWeight: 700, marginTop: 4, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                          <span style={{ color: colors[i], fontWeight: 900 }}>{prizes[i]} Gift Card</span>
                          <select value={player.reward_status || "pending"} onChange={e => updateRewardStatus(player.user_id, e.target.value)} disabled={updatingReward === player.user_id} style={{ fontSize: 10, fontWeight: 800, padding: "3px 6px", borderRadius: 6, background: rs.bg, color: rs.color, border: "1px solid " + rs.color + "40", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                            {["pending", "claimed", "sent", "expired", "disqualified"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {qualifiedStandings.length > 3 && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                  <div style={{ padding: "10px 18px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>Runners Up</div>
                  {qualifiedStandings.slice(3, 10).map((player: any, i: number) => (
                    <div key={player.user_id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: i < Math.min(qualifiedStandings.length - 4, 6) ? "1px solid var(--border)" : "none", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--text-dim)", minWidth: 24 }}>{"#" + (i + 4)}</span>
                        <a href={"/profile/" + player.username} target="_blank" style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", textDecoration: "none" }}>{player.username}</a>
                        {player.is_flagged && <span style={{ fontSize: 10, color: "var(--neon-pink)" }}>⚠️</span>}
                      </div>
                      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>{player.quizzes_completed} quizzes</span>
                        <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>{player.avg_accuracy}% acc</span>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--neon-green)" }}>{(player.monthly_score || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {(["standings", "flagged", "claims", "close"] as const).map(t => (
              <button key={t} onClick={() => setSeasonTab(t)} style={{ padding: "8px 18px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, background: seasonTab === t ? "#B84CFF" : "var(--surface)", color: seasonTab === t ? "#fff" : "var(--text-muted)", WebkitTextFillColor: seasonTab === t ? "#fff" : "var(--text-muted)", textTransform: "capitalize" }}>
                {t === "flagged" ? "⚠️ Flagged (" + flaggedUsers.length + ")" : t === "close" ? "⛔ Close Season" : t === "claims" ? "🎁 Claims" + (pendingClaims > 0 ? " (" + pendingClaims + ")" : "") : "🏆 Standings"}
              </button>
            ))}
          </div>

          {seasonTab === "standings" && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 100px 80px 80px 120px 140px", padding: "10px 20px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>
                <div>Rank</div><div>Player</div><div>Score</div><div>Quizzes</div><div>Accuracy</div><div>Prize</div><div>Actions</div>
              </div>
              {standings.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>No season scores yet.</div> : (
                standings.map((player: any, i: number) => {
                  const rs = rewardStatusColors[player.reward_status || "pending"];
                  const isTop3 = player.rank <= 3 && player.quizzes_completed >= 10 && !player.disqualified;
                  return (
                    <div key={player.user_id} style={{ display: "grid", gridTemplateColumns: "50px 1fr 100px 80px 80px 120px 140px", alignItems: "center", padding: "14px 20px", borderBottom: i < standings.length - 1 ? "1px solid var(--border)" : "none", background: player.disqualified ? "rgba(255,60,172,0.03)" : "transparent" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: player.rank <= 3 ? (["var(--neon-yellow)", "#C0C0C0", "#CD7F32"] as string[])[player.rank - 1] : "var(--text-dim)" }}>{player.rank}</div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <a href={"/profile/" + player.username} target="_blank" style={{ fontWeight: 800, fontSize: 14, color: player.disqualified ? "var(--text-dim)" : "var(--text)", textDecoration: "none" }}>{player.username}</a>
                          {player.is_flagged && <span style={{ fontSize: 10, color: "var(--neon-pink)" }}>⚠️</span>}
                          {player.disqualified && <span style={{ fontSize: 10, color: "var(--neon-pink)", fontWeight: 800 }}>❌ DQ</span>}
                        </div>
                        {!player.qualifies && !player.disqualified && <div style={{ fontSize: 10, color: "var(--neon-yellow)", fontWeight: 700 }}>Need 10 quizzes</div>}
                      </div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--neon-green)" }}>{(player.monthly_score || 0).toLocaleString()}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700 }}>{player.quizzes_completed}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700 }}>{player.avg_accuracy + "%"}</div>
                      <div>{isTop3 ? <select value={player.reward_status || "pending"} onChange={e => updateRewardStatus(player.user_id, e.target.value)} disabled={updatingReward === player.user_id} style={{ fontSize: 11, fontWeight: 800, padding: "4px 8px", borderRadius: 8, background: rs.bg, color: rs.color, border: "1px solid " + rs.color + "40", cursor: "pointer", fontFamily: "var(--font-body)" }}>{["pending", "claimed", "sent", "expired", "disqualified"].map(s => <option key={s} value={s}>{s}</option>)}</select> : <span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>—</span>}</div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {!player.disqualified && (<>
                          <select value={disqualifyReason[player.user_id] || ""} onChange={e => setDisqualifyReason(prev => ({ ...prev, [player.user_id]: e.target.value }))} style={{ fontSize: 10, padding: "3px 6px", borderRadius: 6, background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", fontFamily: "var(--font-body)" }}>
                            <option value="">Reason</option>
                            {DISQUALIFY_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <button onClick={() => disqualifyUser(player.user_id)} disabled={disqualifying === player.user_id} style={{ fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 100, background: "rgba(255,60,172,0.1)", color: "var(--neon-pink)", border: "none", cursor: "pointer" }}>{disqualifying === player.user_id ? "..." : "DQ"}</button>
                        </>)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {seasonTab === "flagged" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {flaggedUsers.length === 0 ? <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 40, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>No flagged accounts! 🎉</div> : (
                flaggedUsers.map((u: any) => (
                  <div key={u.id} style={{ background: "var(--bg-card)", border: "1px solid rgba(255,60,172,0.2)", borderRadius: "var(--radius)", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><span style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>{u.username}</span><span style={{ fontSize: 10, fontWeight: 900, padding: "2px 8px", borderRadius: 100, background: "rgba(255,60,172,0.1)", color: "var(--neon-pink)" }}>⚠️ Flagged</span></div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{"Reason: " + (u.flag_reason || "Unknown")}</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600, marginTop: 2 }}>{"XP: " + u.xp + " • Streak: " + u.streak + " days"}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <select value={disqualifyReason[u.id] || ""} onChange={e => setDisqualifyReason(prev => ({ ...prev, [u.id]: e.target.value }))} style={{ fontSize: 11, padding: "6px 10px", borderRadius: 8, background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", fontFamily: "var(--font-body)" }}>
                        <option value="">Select reason</option>
                        {DISQUALIFY_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <button onClick={() => disqualifyUser(u.id)} disabled={disqualifying === u.id} style={{ fontSize: 12, fontWeight: 800, padding: "8px 16px", borderRadius: 100, background: "rgba(255,60,172,0.1)", color: "var(--neon-pink)", border: "none", cursor: "pointer" }}>{disqualifying === u.id ? "..." : "Disqualify"}</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {seasonTab === "claims" && (
            <div>
              {claims.length === 0 ? <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 48, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>No prize claims submitted yet.</div> : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {claims.map((claim: any) => {
                    const cs = claimStatusColors[claim.status] || claimStatusColors.pending;
                    const prizeAmount = PRIZE_AMOUNTS[claim.rank] || "Unknown";
                    return (
                      <div key={claim.id} style={{ background: "var(--bg-card)", border: "1px solid " + (claim.status === "pending" ? "rgba(255,227,71,0.2)" : claim.status === "sent" ? "rgba(0,245,160,0.2)" : "var(--border)"), borderRadius: "var(--radius)", padding: "20px 24px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                              <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: claim.rank === 1 ? "var(--neon-yellow)" : claim.rank === 2 ? "#C0C0C0" : "#CD7F32" }}>{claim.rank === 1 ? "👑" : claim.rank === 2 ? "🥈" : "🥉"} #{claim.rank}</span>
                              <a href={"/profile/" + claim.username} target="_blank" style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", textDecoration: "none" }}>{claim.username}</a>
                              <span style={{ fontSize: 11, fontWeight: 900, padding: "3px 12px", borderRadius: 100, background: "rgba(255,227,71,0.1)", color: "var(--neon-yellow)" }}>{prizeAmount} Gift Card</span>
                              <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 100, background: cs.bg, color: cs.color, textTransform: "uppercase" }}>{claim.status}</span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginTop: 4 }}>
                              <div style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 14px" }}>
                                <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Roblox Username</div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                                  <span style={{ fontSize: 14, fontWeight: 800, color: "var(--neon-green)" }}>{claim.roblox_username}</span>
                                  <button onClick={() => copyToClipboard(claim.roblox_username, claim.id + "-roblox")} style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 6, background: "rgba(0,245,160,0.1)", color: "var(--neon-green)", border: "none", cursor: "pointer" }}>{copiedEmail === claim.id + "-roblox" ? "✓" : "Copy"}</button>
                                </div>
                              </div>
                              <div style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 14px" }}>
                                <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Email</div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{claim.email}</span>
                                  <button onClick={() => copyToClipboard(claim.email, claim.id + "-email")} style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 6, background: "rgba(0,217,255,0.1)", color: "var(--neon-blue)", border: "none", cursor: "pointer" }}>{copiedEmail === claim.id + "-email" ? "✓" : "Copy"}</button>
                                </div>
                              </div>
                              {claim.discord && <div style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 14px" }}><div style={{ fontSize: 10, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Discord</div><span style={{ fontSize: 13, fontWeight: 700, color: "#B84CFF" }}>{claim.discord}</span></div>}
                              <div style={{ background: "var(--surface)", borderRadius: 8, padding: "10px 14px" }}>
                                <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Submitted</div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>{new Date(claim.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                            {claim.status === "pending" && <button onClick={() => updateClaimStatus(claim.id, "sent")} disabled={updatingClaim === claim.id} style={{ padding: "10px 20px", borderRadius: 100, border: "none", background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: "var(--bg)" }}>{updatingClaim === claim.id ? "⏳ Updating..." : "✅ Mark as Sent"}</button>}
                            {claim.status === "pending" && <button onClick={() => updateClaimStatus(claim.id, "rejected")} disabled={updatingClaim === claim.id} style={{ padding: "10px 20px", borderRadius: 100, border: "1px solid rgba(255,60,172,0.3)", background: "rgba(255,60,172,0.1)", color: "var(--neon-pink)", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" }}>❌ Reject</button>}
                            {claim.status === "sent" && <span style={{ fontSize: 12, fontWeight: 800, padding: "8px 16px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "var(--neon-green)", textAlign: "center" }}>✓ Gift Card Sent</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {seasonTab === "close" && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 32 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 12 }}>⛔ Close Season 1</h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, marginBottom: 20 }}>Closing the season will snapshot the final standings, freeze scores, and mark the top 3 qualifying players as prize winners. This action cannot be undone.</p>
              <div style={{ background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: 20, marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Season 1 Summary</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[{ label: "Total players", value: standings.length }, { label: "Qualifying players (10+ quizzes)", value: qualifiedStandings.length }, { label: "Prize winners (top 3)", value: Math.min(3, qualifiedStandings.length) }, { label: "Flagged accounts", value: flaggedUsers.length }, { label: "Prize claims submitted", value: claims.length }].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}><span style={{ color: "var(--text-muted)" }}>{label}</span><span style={{ color: "var(--text)" }}>{value}</span></div>
                  ))}
                </div>
              </div>
              {seasonClosed ? (
                <div style={{ padding: "16px 24px", background: "rgba(0,245,160,0.1)", border: "1px solid rgba(0,245,160,0.3)", borderRadius: 12, fontSize: 14, fontWeight: 800, color: "var(--neon-green)", textAlign: "center" }}>✅ Season 1 closed successfully! Results snapshot saved.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <button onClick={notifyWinners} disabled={notifyingWinners} style={{ padding: "14px 32px", borderRadius: 100, border: "none", background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, cursor: notifyingWinners ? "default" : "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: "var(--bg)", opacity: notifyingWinners ? 0.7 : 1 }}>{notifyingWinners ? "⏳ Sending emails..." : "📧 Notify Winners via Email"}</button>
                  {notifyResult && <div style={{ padding: "12px 16px", background: "rgba(0,245,160,0.1)", border: "1px solid rgba(0,245,160,0.2)", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "var(--neon-green)" }}>{"✅ Sent: " + notifyResult.sent.join(", ") + (notifyResult.failed.length > 0 ? " • ❌ Failed: " + notifyResult.failed.join(", ") : "")}</div>}
                  <button onClick={closeSeason} disabled={closingSeason} style={{ padding: "14px 32px", borderRadius: 100, border: "1px solid rgba(255,60,172,0.3)", background: "rgba(255,60,172,0.15)", color: "var(--neon-pink)", fontWeight: 900, fontSize: 14, cursor: closingSeason ? "default" : "pointer", fontFamily: "var(--font-body)" }}>{closingSeason ? "⏳ Closing Season..." : "⛔ Close Season 1 & Snapshot Results"}</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Silos Tab */}
      {tab === "silos" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
            {[{ label: "🏆 Strong Silos (15+)", value: strongCount, color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" }, { label: "📈 Growing Silos (8-14)", value: growingCount, color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" }, { label: "🔴 Weak Silos (<8)", value: weakCount, color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" }].map(({ label, value, color, bg }) => (
              <div key={label} style={{ background: bg, border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color, marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {siloData.map(silo => {
              const pct = Math.min(100, Math.round((silo.count / 15) * 100));
              return (
                <div key={silo.game} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "18px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <a href={"/games/" + silo.slug} target="_blank" style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", textDecoration: "none" }}>{silo.game}</a>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 100, background: silo.strength.bg, color: silo.strength.color }}>{silo.strength.label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-muted)" }}>{silo.count + " / 15 quizzes"}</span>
                      <a href={"/games/" + silo.slug} target="_blank" style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: "rgba(0,217,255,0.1)", color: "var(--neon-blue)", textDecoration: "none" }}>View Hub →</a>
                    </div>
                  </div>
                  <div style={{ height: 6, background: "var(--surface)", borderRadius: 100, marginBottom: 12, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: pct + "%", background: silo.count >= 15 ? "var(--neon-green)" : silo.count >= 8 ? "var(--neon-yellow)" : "var(--neon-pink)", borderRadius: 100 }} />
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {ANGLES.map(angle => {
                      const count = silo.angleBreakdown[angle];
                      return <span key={angle} style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, background: count > 0 ? "rgba(184,76,255,0.15)" : "var(--surface)", color: count > 0 ? "#B84CFF" : "var(--text-dim)", border: "1px solid " + (count > 0 ? "rgba(184,76,255,0.3)" : "var(--border)") }}>{angle} {count > 0 ? "(" + count + ")" : "✗"}</span>;
                    })}
                    {silo.uncategorized > 0 && <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, background: "rgba(0,217,255,0.1)", color: "var(--neon-blue)", border: "1px solid rgba(0,217,255,0.2)" }}>{"Other (" + silo.uncategorized + ")"}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quizzes Tab */}
      {tab === "quizzes" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <input type="text" placeholder="🔍 Search quizzes..." value={search} onChange={e => { setSearch(e.target.value); setQuizPage(1); }} style={{ padding: "10px 20px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 100, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", minWidth: 260 }} />
            <div style={{ display: "flex", gap: 6 }}>
              {["All", "static", "generated", "admin"].map(s => (
                <button key={s} onClick={() => { setSourceFilter(s); setQuizPage(1); }} style={{ padding: "8px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, background: sourceFilter === s ? "#B84CFF" : "var(--surface)", color: sourceFilter === s ? "#fff" : "var(--text-muted)", WebkitTextFillColor: sourceFilter === s ? "#fff" : "var(--text-muted)", textTransform: "capitalize" }}>
                  {s === "static" ? "📁 Static (" + staticCount + ")" : s === "generated" ? "🤖 Generated (" + generatedCount + ")" : s === "admin" ? "✍️ Admin (" + adminCount + ")" : "All"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {(["All", "Published", "Draft"] as const).map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setQuizPage(1); }} style={{ padding: "8px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, background: statusFilter === s ? (s === "Draft" ? "var(--neon-yellow)" : "var(--neon-green)") : "var(--surface)", color: statusFilter === s ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: statusFilter === s ? "var(--bg)" : "var(--text-muted)" }}>
                {s === "Draft" ? "⏳ Drafts (" + draftCount + ")" : s === "Published" ? "✅ Published" : "All"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {games.map(g => (
              <button key={g} onClick={() => { setGameFilter(g); setQuizPage(1); }} style={{ padding: "5px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 11, background: gameFilter === g ? "var(--gradient-main)" : "var(--surface)", color: gameFilter === g ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: gameFilter === g ? "var(--bg)" : "var(--text-muted)" }}>{g}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase" }}>Sort:</span>
            {(["none", "difficulty", "angle", "title_asc", "title_desc", "date_desc", "date_asc"] as const).map(s => (
              <button key={s} onClick={() => { setSortBy(s); setQuizPage(1); }} style={{ padding: "5px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 11, background: sortBy === s ? "var(--neon-yellow)" : "var(--surface)", color: sortBy === s ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: sortBy === s ? "var(--bg)" : "var(--text-muted)" }}>
                {s === "none" ? "Default" : s === "difficulty" ? "Difficulty" : s === "angle" ? "Angle" : s === "title_asc" ? "Title A–Z" : s === "title_desc" ? "Title Z–A" : s === "date_desc" ? "Newest First" : "Oldest First"}
              </button>
            ))}
            <span style={{ fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", marginLeft: 8 }}>Angle:</span>
            {(["All", "Unassigned", ...ANGLES.slice(0, 10)]).map(a => (
              <button key={a} onClick={() => { setAngleFilter(a); setQuizPage(1); }} style={{ padding: "5px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 11, background: angleFilter === a ? "#B84CFF" : "var(--surface)", color: angleFilter === a ? "#fff" : "var(--text-muted)", WebkitTextFillColor: angleFilter === a ? "#fff" : "var(--text-muted)" }}>{a}</button>
            ))}
            <select value={angleFilter} onChange={e => { setAngleFilter(e.target.value); setQuizPage(1); }} style={{ padding: "5px 10px", borderRadius: 100, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-body)", fontWeight: 800, cursor: "pointer" }}>
              <option value="All">All angles</option>
              <option value="Unassigned">Unassigned</option>
              {ANGLES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 80px 40px 70px 150px 90px 130px", padding: "10px 20px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>
              <div>Title</div><div>Game</div><div>Diff</div><div>Qs</div><div>Source</div><div>Angle</div><div>Published</div><div>Actions</div>
            </div>

            {paginatedQuizzes.map((quiz, i) => {
              const diff = diffColors[quiz.difficulty] || diffColors.Medium;
              const isDraft = quiz.status === "draft";
              const isExpanded = editingQuiz === quiz.slug;
              const isEditable = quiz.source === "generated" || quiz.source === "admin";

              return (
                <div key={quiz.slug} style={{ borderBottom: i < paginatedQuizzes.length - 1 ? "1px solid var(--border)" : "none" }}>
                  {/* Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 80px 40px 70px 150px 90px 130px", alignItems: "center", padding: "12px 20px", background: isDraft ? "rgba(255,227,71,0.02)" : "transparent" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        {isDraft && <span style={{ fontSize: 9, fontWeight: 900, padding: "1px 6px", borderRadius: 100, background: "rgba(255,227,71,0.15)", color: "var(--neon-yellow)", textTransform: "uppercase" }}>Draft</span>}
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{quiz.title}</span>
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-dim)" }}>{quiz.slug}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>{quiz.game}</div>
                    <div><span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 100, background: diff.bg, color: diff.color }}>{quiz.difficulty}</span></div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>{quiz.questions}</div>
                    <div><span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 100, background: quiz.source === "generated" ? "rgba(184,76,255,0.15)" : "rgba(0,217,255,0.1)", color: quiz.source === "generated" ? "#B84CFF" : "var(--neon-blue)" }}>{quiz.source === "generated" ? "🤖 AI" : quiz.source === "admin" ? "✍️" : "📁"}</span></div>
                    <div>
                      <select value={quiz.angle || ""} onChange={e => updateAngle(quiz.slug, e.target.value)} disabled={updatingAngle === quiz.slug} style={{ fontSize: 10, fontWeight: 800, padding: "3px 6px", borderRadius: 6, background: quiz.angle ? "rgba(184,76,255,0.1)" : "var(--surface)", color: quiz.angle ? "#B84CFF" : "var(--text-dim)", border: "1px solid " + (quiz.angle ? "rgba(184,76,255,0.3)" : "var(--border)"), cursor: "pointer", fontFamily: "var(--font-body)", maxWidth: 140 }}>
                        <option value="">— unset —</option>
                        {ANGLES.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    {/* Published date */}
                    <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>
                      {isDraft ? <span style={{ color: "var(--neon-yellow)" }}>Draft</span> : formatDate(quiz.published_at)}
                    </div>
                    {/* Actions */}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {isEditable && (
                        <button onClick={() => loadQuizForEdit(quiz.slug)} disabled={loadingQuiz === quiz.slug}
                          style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 100, background: isExpanded ? (isDraft ? "rgba(255,227,71,0.2)" : "rgba(0,217,255,0.2)") : (isDraft ? "rgba(255,227,71,0.1)" : "rgba(0,217,255,0.1)"), color: isDraft ? "var(--neon-yellow)" : "var(--neon-blue)", border: "1px solid " + (isDraft ? "rgba(255,227,71,0.3)" : "rgba(0,217,255,0.3)"), cursor: "pointer" }}>
                          {loadingQuiz === quiz.slug ? "⏳" : isExpanded ? "Close" : "✏️ Edit"}
                        </button>
                      )}
                      {!isDraft && !isEditable && (
                        <a href={"/quiz/" + quiz.slug} target="_blank" style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 100, background: "rgba(0,217,255,0.1)", color: "var(--neon-blue)", textDecoration: "none" }}>View</a>
                      )}
                      {isDraft && (
                        <button onClick={() => publishQuiz(quiz.slug)}
                          style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 100, background: "rgba(0,245,160,0.15)", color: "var(--neon-green)", border: "1px solid rgba(0,245,160,0.3)", cursor: "pointer" }}>🚀</button>
                      )}
                      {isEditable && (
                        <button onClick={() => deleteQuiz(quiz.slug)} disabled={deleting === quiz.slug}
                          style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 100, background: "rgba(255,60,172,0.1)", color: "var(--neon-pink)", border: "none", cursor: "pointer" }}>
                          {deleting === quiz.slug ? "..." : "🗑️"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Editor */}
                  {isExpanded && quizEditData && (
                    <div style={{ borderTop: "1px solid " + (isDraft ? "rgba(255,227,71,0.2)" : "rgba(0,217,255,0.2)"), background: isDraft ? "rgba(255,227,71,0.03)" : "rgba(0,217,255,0.03)", padding: 24 }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: isDraft ? "var(--neon-yellow)" : "var(--neon-blue)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>
                        {isDraft ? "✏️ Edit Draft Questions" : "✏️ Edit Published Quiz"}
                      </div>

                      {quizEditData.loadError ? (
                        <div style={{ color: "var(--neon-pink)", fontWeight: 700, fontSize: 13 }}>{quizEditData.loadError}</div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          {quizEditData.questions.map((q: any, qi: number) => (
                            <div key={qi} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 18 }}>
                              <div style={{ fontSize: 11, fontWeight: 900, color: "#B84CFF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Question {qi + 1}</div>
                              <textarea value={q.q} onChange={e => updateQuizQuestion(qi, "q", e.target.value)} rows={2}
                                style={{ width: "100%", padding: "10px 14px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 600, resize: "vertical", boxSizing: "border-box", marginBottom: 10 }} />
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {q.a.map((ans: string, ai: number) => (
                                  <div key={ai} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <button onClick={() => updateQuizQuestion(qi, "correct", ai)}
                                      style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid " + (q.correct === ai ? "var(--neon-green)" : "var(--border)"), background: q.correct === ai ? "rgba(0,245,160,0.15)" : "var(--surface)", color: q.correct === ai ? "var(--neon-green)" : "var(--text-dim)", fontSize: 11, fontWeight: 900, cursor: "pointer", flexShrink: 0 }}>
                                      {["A","B","C","D"][ai]}
                                    </button>
                                    <input value={ans} onChange={e => updateQuizAnswer(qi, ai, e.target.value)}
                                      style={{ flex: 1, padding: "8px 12px", background: "var(--surface)", border: "1.5px solid " + (q.correct === ai ? "var(--neon-green)" : "var(--border)"), borderRadius: 8, color: "var(--text)", fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 600 }} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
                        <button onClick={() => saveQuizEdit(quiz.slug, false)} disabled={savingQuiz}
                          style={{ padding: "10px 24px", borderRadius: 100, border: "1px solid " + (isDraft ? "rgba(255,227,71,0.4)" : "rgba(0,217,255,0.4)"), background: quizSaveSuccess === quiz.slug ? "rgba(0,245,160,0.15)" : (isDraft ? "rgba(255,227,71,0.1)" : "rgba(0,217,255,0.1)"), color: quizSaveSuccess === quiz.slug ? "var(--neon-green)" : (isDraft ? "var(--neon-yellow)" : "var(--neon-blue)"), fontWeight: 900, fontSize: 13, cursor: savingQuiz ? "default" : "pointer", fontFamily: "var(--font-body)" }}>
                          {savingQuiz ? "⏳ Saving..." : quizSaveSuccess === quiz.slug ? "✅ Saved!" : "💾 Save Changes"}
                        </button>
                        {isDraft && (
                          <button onClick={() => saveQuizEdit(quiz.slug, true)} disabled={savingQuiz}
                            style={{ padding: "10px 24px", borderRadius: 100, border: "none", background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 13, cursor: savingQuiz ? "default" : "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: "var(--bg)" }}>
                            {savingQuiz ? "⏳ Saving..." : "🚀 Save & Publish"}
                          </button>
                        )}
                        {!isDraft && (
                          <a href={"/quiz/" + quiz.slug} target="_blank"
                            style={{ padding: "10px 24px", borderRadius: 100, border: "1px solid rgba(0,217,255,0.3)", background: "rgba(0,217,255,0.08)", color: "var(--neon-blue)", fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
                            🔗 View Live
                          </a>
                        )}
                        <button onClick={() => { setEditingQuiz(null); setQuizEditData(null); }}
                          style={{ padding: "10px 24px", borderRadius: 100, border: "1px solid var(--border)", background: "none", color: "var(--text-muted)", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>{"Showing " + ((quizPage - 1) * QUIZ_PAGE_SIZE + 1) + "–" + Math.min(quizPage * QUIZ_PAGE_SIZE, filtered.length) + " of " + filtered.length + " quizzes"}</div>
            {quizTotalPages > 1 && (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button onClick={() => setQuizPage(p => Math.max(1, p - 1))} disabled={quizPage === 1} style={{ padding: "6px 16px", borderRadius: 100, border: "none", cursor: quizPage === 1 ? "default" : "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, background: "var(--surface)", color: "var(--text-muted)", opacity: quizPage === 1 ? 0.4 : 1 }}>← Prev</button>
                {Array.from({ length: quizTotalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setQuizPage(p)} style={{ padding: "6px 12px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, minWidth: 36, background: quizPage === p ? "var(--gradient-main)" : "var(--surface)", color: quizPage === p ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: quizPage === p ? "var(--bg)" : "var(--text-muted)" }}>{p}</button>
                ))}
                <button onClick={() => setQuizPage(p => Math.min(quizTotalPages, p + 1))} disabled={quizPage === quizTotalPages} style={{ padding: "6px 16px", borderRadius: 100, border: "none", cursor: quizPage === quizTotalPages ? "default" : "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, background: "var(--surface)", color: "var(--text-muted)", opacity: quizPage === quizTotalPages ? 0.4 : 1 }}>Next →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Flags Tab */}
      {tab === "flags" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {flags.length === 0 ? (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 40, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>No open flags! 🎉</div>
          ) : (
            flags.map((f: any) => (
              <div key={f.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr 120px 100px auto", alignItems: "center", padding: "14px 20px", gap: 12 }}>
                  <div><a href={"/quiz/" + f.quiz_slug} target="_blank" style={{ fontSize: 13, fontWeight: 700, color: "var(--neon-blue)", textDecoration: "none" }}>{f.quiz_slug}</a></div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>{"Q" + (f.question_index + 1)}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{f.reason || "No reason given"}</div>
                  <div style={{ fontSize: 11, color: "var(--neon-blue)", fontWeight: 700 }}>{"👤 " + (f.username || "Anonymous")}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{new Date(f.created_at).toLocaleDateString()}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => startEdit(f)} style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: editingFlag === f.id ? "rgba(255,227,71,0.15)" : "rgba(0,217,255,0.1)", color: editingFlag === f.id ? "var(--neon-yellow)" : "var(--neon-blue)", border: "none", cursor: "pointer" }}>{editingFlag === f.id ? "Close" : "✏️ Edit"}</button>
                    <button onClick={() => dismissFlag(f.id)} disabled={dismissing === f.id} style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: "rgba(0,245,160,0.1)", color: "var(--neon-green)", border: "none", cursor: "pointer" }}>{dismissing === f.id ? "..." : "✅ Dismiss"}</button>
                  </div>
                </div>
                {editingFlag === f.id && editData && (
                  <div style={{ borderTop: "1px solid var(--border)", padding: 20, background: "var(--surface)" }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Edit Question</div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Question</label>
                      <textarea value={editData.question} onChange={e => setEditData({ ...editData, question: e.target.value })} rows={2} style={{ width: "100%", padding: "10px 14px", background: "var(--bg-card)", border: "1.5px solid var(--border)", borderRadius: 10, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, resize: "vertical", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Answer Options</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {editData.answers.map((ans, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <button onClick={() => setEditData({ ...editData, correct: j })} style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid " + (editData.correct === j ? "var(--neon-green)" : "var(--border)"), background: editData.correct === j ? "rgba(0,245,160,0.15)" : "var(--bg-card)", color: editData.correct === j ? "var(--neon-green)" : "var(--text-dim)", fontSize: 12, fontWeight: 900, cursor: "pointer", flexShrink: 0 }}>{["A", "B", "C", "D"][j]}</button>
                            <input value={ans} onChange={e => { const a = [...editData!.answers]; a[j] = e.target.value; setEditData({ ...editData!, answers: a }); }} style={{ flex: 1, padding: "8px 14px", background: "var(--bg-card)", border: "1.5px solid " + (editData.correct === j ? "var(--neon-green)" : "var(--border)"), borderRadius: 8, color: "var(--text)", fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 600 }} />
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600, marginTop: 8 }}>Click a letter to set the correct answer</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => saveEdit(f)} disabled={saving} style={{ padding: "10px 24px", borderRadius: 100, border: "none", background: saveSuccess === f.id ? "rgba(0,245,160,0.2)" : "var(--gradient-main)", color: saveSuccess === f.id ? "var(--neon-green)" : "var(--bg)", fontWeight: 900, fontSize: 13, cursor: saving ? "default" : "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: saveSuccess === f.id ? "var(--neon-green)" : "var(--bg)" }}>{saving ? "Saving..." : saveSuccess === f.id ? "✅ Saved!" : "Save Changes"}</button>
                      <button onClick={() => dismissFlag(f.id)} disabled={dismissing === f.id} style={{ padding: "10px 24px", borderRadius: 100, border: "none", background: "rgba(0,245,160,0.1)", color: "var(--neon-green)", fontWeight: 900, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" }}>Save & Dismiss</button>
                      <button onClick={() => { setEditingFlag(null); setEditData(null); }} style={{ padding: "10px 24px", borderRadius: 100, border: "1px solid var(--border)", background: "none", color: "var(--text-muted)", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Submit Quiz Tab */}
      {tab === "submit" && <SubmitQuizTab />}

      {/* Logs Tab */}
      {tab === "logs" && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          {cronLogs.length === 0 ? <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>No cron logs yet.</div> : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "80px 120px 100px 1fr 180px 140px", padding: "10px 20px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 900, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>
                <div>Status</div><div>Game</div><div>Angle</div><div>Quiz / Error</div><div>Fact-Check</div><div>Date</div>
              </div>
              {cronLogs.map((log, i) => {
                const lc = logColors[log.status] || logColors.skipped;
                const allConfident = log.notes === "fact-check: all confident";
                const hasChanges = log.notes && log.notes.startsWith("fact-check:") && !allConfident;
                return (
                  <div key={log.id} style={{ display: "grid", gridTemplateColumns: "80px 120px 100px 1fr 180px 140px", alignItems: "center", padding: "12px 20px", borderBottom: i < cronLogs.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div><span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 100, background: lc.bg, color: lc.color, textTransform: "uppercase" }}>{log.status}</span></div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>{log.game || "—"}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>{log.angle || "—"}</div>
                    <div style={{ fontSize: 12, color: log.error ? "var(--neon-pink)" : "var(--text-muted)", fontWeight: 600 }}>{log.quiz_slug ? <a href={"/quiz/" + log.quiz_slug} target="_blank" style={{ color: "var(--neon-blue)", textDecoration: "none", fontWeight: 700 }}>{log.quiz_slug}</a> : log.error || "—"}</div>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>
                      {allConfident && <span style={{ color: "var(--neon-green)" }}>✅ All confident</span>}
                      {hasChanges && <span style={{ color: "var(--neon-yellow)" }}>⚠️ {log.notes.replace("fact-check: ", "")}</span>}
                      {!log.notes && <span style={{ color: "var(--text-dim)" }}>—</span>}
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