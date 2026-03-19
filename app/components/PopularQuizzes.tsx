"use client";
import { useEffect, useState } from "react";

const diffColors: Record<string, { color: string, bg: string }> = {
  Easy: { color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" },
  Medium: { color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" },
  Hard: { color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" },
};

export default function PopularQuizzes({ initialQuizzes }: { initialQuizzes: any[] }) {
  const [quizzes, setQuizzes] = useState<any[]>(initialQuizzes);

  useEffect(() => {
    fetch("/api/quizzes?limit=8")
      .then(r => r.json())
      .then(data => setQuizzes(data.quizzes || []));
  }, []);

  return (
    <div id="quizzes" style={{ position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>{"🏆 Popular Quizzes"}</h2>
        <a href="/browse" style={{ color: "var(--neon-green)", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>{"See All →"}</a>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {quizzes.map((quiz) => {
          const diff = diffColors[quiz.difficulty] || diffColors.Medium;
          return (
            <a href={"/quiz/" + quiz.slug} key={quiz.slug} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", cursor: "pointer", textDecoration: "none", display: "block" }}>
              <div style={{ height: 140, position: "relative", overflow: "hidden" }}>
                {quiz.thumbIsImage ? (
                  <>
                    <img
                      src={quiz.thumb.replace("url(", "").replace(")", "")}
                      alt={quiz.game}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
                  </>
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, background: quiz.thumb }} >
                    {quiz.emoji}
                  </div>
                )}
                <span style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 900, color: "var(--neon-green)" }}>▶ PLAY</span>
                {quiz.thumbIsImage && (
                  <span style={{ position: "absolute", top: 10, left: 10, fontSize: 24 }}>{quiz.emoji}</span>
                )}
              </div>
              <div style={{ padding: "16px 18px 20px" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "rgba(0,217,255,0.1)", color: "var(--neon-blue)" }}>{quiz.game}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: diff.bg, color: diff.color }}>{quiz.difficulty}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "var(--surface)", color: "var(--text-muted)" }}>{quiz.questions} Q's</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, color: "var(--text)" }}>{quiz.title}</h3>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}