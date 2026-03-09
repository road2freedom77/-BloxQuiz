"use client";
import { useEffect, useState } from "react";

const diffColors: Record<string, { color: string, bg: string }> = {
  Easy: { color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" },
  Medium: { color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" },
  Hard: { color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" },
};

const games = ["All", "Blox Fruits", "Brookhaven RP", "Adopt Me!", "Tower of Hell", "Murder Mystery 2", "Grow a Garden", "Royale High", "Doors", "Arsenal", "Anime Fighting Simulator", "Berry Avenue", "Livetopia", "Natural Disaster Survival", "Anime Defenders", "Funky Friday", "Kick Off", "Bee Swarm Simulator", "Dress to Impress"];
const difficulties = ["All", "Easy", "Medium", "Hard"];
const PAGE_SIZE = 12;

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameFilter, setGameFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");
    if (game) setGameFilter(game);
  }, []);

  useEffect(() => {
    fetch("/api/quizzes?limit=200")
      .then(r => r.json())
      .then(data => {
        setQuizzes(data.quizzes || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => { setPage(1); }, [gameFilter, diffFilter, search]);

  const filtered = quizzes.filter(q => {
    if (gameFilter !== "All" && q.game !== gameFilter) return false;
    if (diffFilter !== "All" && q.difficulty !== diffFilter) return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function Pagination() {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => { setPage(p => Math.max(1, p - 1)); scrollToTop(); }}
          disabled={page === 1}
          style={{ padding: "8px 20px", borderRadius: 100, border: "none", cursor: page === 1 ? "default" : "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: "var(--surface)", color: page === 1 ? "var(--text-dim)" : "var(--text-muted)", opacity: page === 1 ? 0.4 : 1 }}
        >{"← Prev"}</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => { setPage(p); scrollToTop(); }}
            style={{ padding: "8px 14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: page === p ? "var(--gradient-main)" : "var(--surface)", color: page === p ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: page === p ? "var(--bg)" : "var(--text-muted)", minWidth: 40 }}
          >{p}</button>
        ))}
        <button
          onClick={() => { setPage(p => Math.min(totalPages, p + 1)); scrollToTop(); }}
          disabled={page === totalPages}
          style={{ padding: "8px 20px", borderRadius: 100, border: "none", cursor: page === totalPages ? "default" : "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 13, background: "var(--surface)", color: page === totalPages ? "var(--text-dim)" : "var(--text-muted)", opacity: page === totalPages ? 0.4 : 1 }}
        >{"Next →"}</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, marginBottom: 8 }}>{"🎮 All Quizzes"}</h1>
      <p style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 32 }}>
        {loading ? "Loading..." : `${quizzes.length} quizzes across ${games.length - 1} Roblox games`}
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="🔍 Search quizzes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: "10px 20px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 100, color: "var(--text)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 600, outline: "none", minWidth: 240 }}
        />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {games.map(g => (
          <button key={g} onClick={() => setGameFilter(g)} style={{ padding: "6px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, background: gameFilter === g ? "var(--gradient-main)" : "var(--surface)", color: gameFilter === g ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: gameFilter === g ? "var(--bg)" : "var(--text-muted)" }}>{g}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {difficulties.map(d => (
          <button key={d} onClick={() => setDiffFilter(d)} style={{ padding: "6px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 12, background: diffFilter === d ? "var(--neon-pink)" : "var(--surface)", color: diffFilter === d ? "var(--bg)" : "var(--text-muted)", WebkitTextFillColor: diffFilter === d ? "var(--bg)" : "var(--text-muted)" }}>{d}</button>
        ))}
      </div>

      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>
            {"Showing " + ((page - 1) * PAGE_SIZE + 1) + "–" + Math.min(page * PAGE_SIZE, filtered.length) + " of " + filtered.length + " quizzes"}
          </div>
          <Pagination />
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", fontWeight: 700, padding: 40 }}>Loading quizzes...</div>
      ) : paginated.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", fontWeight: 700, padding: 40 }}>No quizzes found!</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {paginated.map((quiz) => {
            const diff = diffColors[quiz.difficulty] || diffColors.Medium;
            return (
              <a href={"/quiz/" + quiz.slug} key={quiz.slug} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", cursor: "pointer", textDecoration: "none", display: "block" }}>
                <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, background: quiz.thumb, position: "relative" }}>
                  {quiz.emoji}
                  <span style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 900, color: "var(--neon-green)" }}>▶ PLAY</span>
                </div>
                <div style={{ padding: "14px 16px 18px" }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "rgba(0,217,255,0.1)", color: "var(--neon-blue)" }}>{quiz.game}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: diff.bg, color: diff.color }}>{quiz.difficulty}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "var(--surface)", color: "var(--text-muted)" }}>{quiz.questions} Q's</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{quiz.title}</h3>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <Pagination />
        </div>
      )}
    </div>
  );
}