"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../lib/supabase";

const diffColors: Record<string, { color: string; bg: string }> = {
  Easy: { color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" },
  Medium: { color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" },
  Hard: { color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" },
};

const difficulties = ["All", "Easy", "Medium", "Hard"];

const INTENTS = [
  { id: "all", label: "All Quizzes", emoji: "🎮", keywords: [] },
  { id: "new-player", label: "New Player", emoji: "🚀", keywords: ["beginner", "starter", "new player", "first steps", "essentials", "basics", "getting started", "newcomer"] },
  { id: "lore", label: "Lore & Story", emoji: "📖", keywords: ["lore", "story", "history", "legend", "mystery", "secret", "hidden", "origin", "chronicles", "mysteries"] },
  { id: "trading", label: "Trading", emoji: "💱", keywords: ["trading", "trade", "values", "market", "economy", "rarity", "rare", "worth"] },
  { id: "updates", label: "Updates", emoji: "🔄", keywords: ["update", "updates", "new content", "latest", "patch", "season", "new features"] },
  { id: "hard", label: "Expert Only", emoji: "💀", keywords: ["expert", "advanced", "master", "elite", "ultimate", "champion", "hardest"] },
];

const PAGE_SIZE = 12;

type Quiz = {
  slug: string;
  title: string;
  game: string;
  difficulty: string;
  questions: number;
  published_at: string;
  emoji?: string;
  thumb?: string;
};

type GameHub = { name: string; slug: string; emoji: string };

export default function BrowseClient({
  initialQuizzes,
  totalCount,
  gameHubs,
  initialDifficulty,
  initialSort,
}: {
  initialQuizzes: Quiz[];
  totalCount: number;
  gameHubs: GameHub[];
  initialDifficulty: string;
  initialSort: string;
}) {
  const { user } = useUser();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [gamesList, setGamesList] = useState<string[]>(["All"]);
  const [playedSlugs, setPlayedSlugs] = useState<Set<string>>(new Set());
  const [gameFilter, setGameFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState(
    initialDifficulty !== "all"
      ? initialDifficulty.charAt(0).toUpperCase() + initialDifficulty.slice(1)
      : "All"
  );
  const [intentFilter, setIntentFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    fetch("/api/quizzes?limit=500")
      .then((r) => r.json())
      .then((data) => {
        const qs = data.quizzes || [];
        setQuizzes(qs);
        const distinct = [
          "All",
          ...(Array.from(new Set(qs.map((q: Quiz) => q.game))).sort() as string[]),
        ];
        setGamesList(distinct);
        setPage(1);
        setHydrated(true);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");
    if (game) setGameFilter(game);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("scores")
      .select("quiz_slug")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setPlayedSlugs(new Set(data.map((r) => r.quiz_slug)));
      });
  }, [user?.id]);

  useEffect(() => {
    setPage(1);
  }, [gameFilter, diffFilter, intentFilter, search]);

  const activeIntent = INTENTS.find(i => i.id === intentFilter) || INTENTS[0];

  const filtered = quizzes.filter((q) => {
    if (gameFilter !== "All" && q.game !== gameFilter) return false;
    if (diffFilter !== "All" && q.difficulty !== diffFilter) return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeIntent.keywords.length > 0) {
      const titleLower = q.title.toLowerCase();
      const matches = activeIntent.keywords.some(kw => titleLower.includes(kw));
      if (!matches) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function scrollToGrid() {
    document.querySelector(".quiz-grid-top")?.scrollIntoView({ behavior: "smooth" });
  }

  function Pagination() {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => { setPage((p) => Math.max(1, p - 1)); scrollToGrid(); }}
          disabled={page === 1}
          style={{ padding: "8px 20px", borderRadius: 100, border: "none", cursor: page === 1 ? "default" : "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: "var(--surface)", color: page === 1 ? "var(--text-dim)" : "var(--text-muted)", opacity: page === 1 ? 0.4 : 1 }}
        >{"← Prev"}</button>
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => { setPage(p); scrollToGrid(); }}
            style={{ padding: "8px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: page === p ? "var(--gradient-main)" : "var(--surface)", color: page === p ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: page === p ? "var(--bg)" : "var(--text-muted)", minWidth: 40 }}
          >{p}</button>
        ))}
        <button
          onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); scrollToGrid(); }}
          disabled={page === totalPages}
          style={{ padding: "8px 20px", borderRadius: 100, border: "none", cursor: page === totalPages ? "default" : "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: "var(--surface)", color: page === totalPages ? "var(--text-dim)" : "var(--text-muted)", opacity: page === totalPages ? 0.4 : 1 }}
        >{"Next →"}</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px" }}>

      {/* Search */}
      <div className="quiz-grid-top" style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="🔍 Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px 20px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 100, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", minWidth: 240 }}
        />
      </div>

      {/* Intent filter — what are you looking for? */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: 8 }}>
          What are you looking for?
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {INTENTS.map((intent) => {
            const active = intentFilter === intent.id;
            return (
              <button
                key={intent.id}
                onClick={() => setIntentFilter(intent.id)}
                style={{
                  padding: "7px 16px", borderRadius: 100, border: active ? "1px solid rgba(0,212,255,0.4)" : "1px solid var(--border)",
                  cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12,
                  background: active ? "rgba(0,212,255,0.12)" : "var(--surface)",
                  color: active ? "var(--neon-blue)" : "var(--text-muted)",
                }}
              >
                {intent.emoji} {intent.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Game filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {gamesList.map((g) => (
          <button key={g} onClick={() => setGameFilter(g)}
            style={{ padding: "6px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, background: gameFilter === g ? "var(--gradient-main)" : "var(--surface)", color: gameFilter === g ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: gameFilter === g ? "var(--bg)" : "var(--text-muted)" }}
          >{g}</button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {difficulties.map((d) => (
          <button key={d} onClick={() => setDiffFilter(d)}
            style={{ padding: "6px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, background: diffFilter === d ? "var(--neon-pink)" : "var(--surface)", color: diffFilter === d ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: diffFilter === d ? "var(--bg)" : "var(--text-muted)" }}
          >{d}</button>
        ))}
      </div>

      {/* Results count */}
      {hydrated && filtered.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>
            {"Showing " + ((page - 1) * PAGE_SIZE + 1) + "–" + Math.min(page * PAGE_SIZE, filtered.length) + " of " + filtered.length + " quizzes"}
            {intentFilter !== "all" && (
              <span style={{ marginLeft: 8, color: "var(--neon-blue)" }}>· {activeIntent.emoji} {activeIntent.label}</span>
            )}
          </div>
          <Pagination />
        </div>
      )}

      {hydrated && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontWeight: 700 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No quizzes found</div>
          <div style={{ fontSize: 14 }}>Try adjusting your filters or search term</div>
        </div>
      )}

      {/* Quiz grid */}
      {hydrated && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {paginated.map((quiz) => {
            const diff = diffColors[quiz.difficulty] || diffColors.Medium;
            const played = playedSlugs.has(quiz.slug);
            return (
              <a
                href={"/quiz/" + quiz.slug}
                key={quiz.slug}
                style={{ background: "var(--bg-card)", border: "1px solid " + (played ? "rgba(0,245,160,0.25)" : "var(--border)"), borderRadius: "var(--radius)", overflow: "hidden", cursor: "pointer", textDecoration: "none", display: "block", position: "relative" }}
              >
                <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, background: quiz.thumb, position: "relative" }}>
                  {quiz.emoji}
                  {played ? (
                    <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,245,160,0.15)", backdropFilter: "blur(8px)", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 900, color: "var(--neon-green)", border: "1px solid rgba(0,245,160,0.3)" }}>{"✅ PLAYED"}</span>
                  ) : (
                    <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 900, color: "var(--neon-green)" }}>{"▶ PLAY"}</span>
                  )}
                </div>
                <div style={{ padding: "14px 16px 18px" }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "rgba(0,217,255,0.1)", color: "var(--neon-blue)" }}>{quiz.game}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: diff.bg, color: diff.color }}>{quiz.difficulty}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "var(--surface)", color: "var(--text-muted)" }}>
                      {Array.isArray(quiz.questions) ? quiz.questions.length : quiz.questions} {"Q's"}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{quiz.title}</h3>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {hydrated && filtered.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <Pagination />
        </div>
      )}
    </div>
  );
}