"use client";
import { useState, use } from "react";
import { quizzes as quizData } from "../../data/quizzes";

export default function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const quiz = quizData[slug];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!quiz) return (
    <div style={{ maxWidth: 800, margin: "100px auto", padding: "0 24px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, marginBottom: 16 }}>Quiz Not Found</h1>
      <a href="/" style={{ color: "var(--neon-green)", fontWeight: 800 }}>← Back to Home</a>
    </div>
  );

  const q = quiz.questions[current];
  const letters = ["A", "B", "C", "D"];
  const pct = Math.round(score / quiz.questions.length * 100);

  function selectAnswer(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 < quiz.questions.length) {
        setCurrent(c => c + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        setFinished(true);
      }
    }, 1200);
  }

  function getResultLabel() {
    if (pct >= 90) return { emoji: "🏆", label: "Roblox Legend!" };
    if (pct >= 70) return { emoji: "⭐", label: "Blox Expert!" };
    if (pct >= 50) return { emoji: "👍", label: "Not Bad, Keep Playing!" };
    return { emoji: "😅", label: "Noob Alert! Try Again?" };
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 36, boxShadow: "var(--shadow-card)" }}>
        {!finished ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
              <a href="/" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "8px 18px", borderRadius: 100, fontSize: 13, fontWeight: 800, textDecoration: "none" }}>← Back</a>
              <div style={{ flex: 1, margin: "0 20px", background: "var(--surface)", height: 10, borderRadius: 100, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(current / quiz.questions.length) * 100}%`, background: "var(--gradient-main)", borderRadius: 100, transition: "width 0.4s ease" }} />
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--neon-green)" }}>{score}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Question {current + 1} of {quiz.questions.length}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, lineHeight: 1.3, marginBottom: 28 }}>{q.q}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {q.a.map((ans: string, i: number) => {
                let borderColor = "var(--border)";
                let bg = "var(--surface)";
                let color = "var(--text)";
                if (answered) {
                  if (i === q.correct) { borderColor = "var(--neon-green)"; bg = "rgba(0,245,160,0.1)"; color = "var(--neon-green)"; }
                  else if (i === selected) { borderColor = "var(--neon-pink)"; bg = "rgba(255,60,172,0.1)"; color = "var(--neon-pink)"; }
                  else { bg = "var(--surface)"; color = "var(--text-dim)"; }
                }
                return (
                  <button key={i} onClick={() => selectAnswer(i)} style={{ background: bg, border: `2px solid ${borderColor}`, borderRadius: "var(--radius-sm)", padding: "18px 20px", fontSize: 15, fontWeight: 700, cursor: answered ? "default" : "pointer", fontFamily: "var(--font-body)", color, textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 8, background: "var(--bg-card)", fontSize: 13, fontWeight: 900, color: "var(--text-dim)", flexShrink: 0 }}>{letters[i]}</span>
                    {ans}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>{getResultLabel().emoji}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 56, background: "var(--gradient-main)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>{score}/{quiz.questions.length}</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{getResultLabel().label}</div>
            <div style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 28 }}>You scored better than {Math.min(95, pct + Math.floor(Math.random() * 15))}% of players</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setCurrent(0); setScore(0); setSelected(null); setAnswered(false); setFinished(false); }} style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "14px 24px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: "var(--bg)" }}>🔄 Play Again</button>
              <a href="/" style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "14px 24px", borderRadius: 100, border: "1px solid var(--border)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>🏠 Home</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}