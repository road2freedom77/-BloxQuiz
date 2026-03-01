"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useUser } from "@clerk/nextjs";

const gameSlugMap: Record<string, string> = {
  "Blox Fruits": "blox-fruits",
  "Brookhaven RP": "brookhaven",
  "Adopt Me!": "adopt-me",
  "Tower of Hell": "tower-of-hell",
  "Murder Mystery 2": "murder-mystery-2",
  "Grow a Garden": "grow-a-garden",
};

const diffColors: Record<string, { color: string, bg: string }> = {
  Easy: { color: "var(--neon-green)", bg: "rgba(0,245,160,0.1)" },
  Medium: { color: "var(--neon-yellow)", bg: "rgba(255,227,71,0.1)" },
  Hard: { color: "var(--neon-pink)", bg: "rgba(255,60,172,0.1)" },
};

export default function QuizClient({ quiz, slug }: { quiz: any, slug: string }) {
  const { user } = useUser();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = quiz.questions[current];
  const letters = ["A", "B", "C", "D"];
  const pct = Math.round(score / quiz.questions.length * 100);
  const gameSlug = gameSlugMap[quiz.game] || "blox-fruits";
  const diff = diffColors[quiz.difficulty] || diffColors.Medium;

  async function saveScore(finalScore: number) {
    await supabase.from("plays").insert({
      quiz_slug: slug,
      score: finalScore,
      total_questions: quiz.questions.length,
    });

    if (!user) return;

    await supabase.from("users").upsert({
      id: user.id,
      username: user.username || user.firstName || "Anonymous",
      email: user.emailAddresses[0]?.emailAddress,
    }, { onConflict: "id" });

    await supabase.from("scores").insert({
      user_id: user.id,
      quiz_slug: slug,
      score: finalScore,
      total_questions: quiz.questions.length,
    });

    const xpGained = finalScore * 10;
    const { data, error } = await supabase.rpc("increment_xp", {
      user_id: user.id,
      amount: xpGained
    });
    console.log("XP result:", data, error);
  }

  function selectAnswer(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === q.correct;
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 < quiz.questions.length) {
        setCurrent(c => c + 1);
        setSelected(null);
        setAnswered(false);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        setFinished(true);
        saveScore(finalScore);
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
      
      {/* H1 intro block — hidden during quiz, visible for SEO */}
      {!finished && (
  <div style={{
    marginBottom: current === 0 && !answered ? 24 : 0,
    height: current === 0 && !answered ? "auto" : 0,
    opacity: current === 0 && !answered ? 1 : 0,
    overflow: "hidden",
    transition: "all 0.3s ease",
    textAlign: "center"
  }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 100, textTransform: "uppercase", background: "rgba(0,217,255,0.1)", color: "var(--neon-blue)" }}>{quiz.game}</span>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 100, textTransform: "uppercase", background: diff.bg, color: diff.color }}>{quiz.difficulty}</span>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 100, textTransform: "uppercase", background: "var(--surface)", color: "var(--text-muted)" }}>{quiz.questions.length} Questions</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 4vw, 32px)", marginBottom: 8 }}>{quiz.title}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 600, maxWidth: 500, margin: "0 auto" }}>
            Test your {quiz.game} knowledge across {quiz.questions.length} questions. Can you get a perfect score?
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
            <a href={`/games/${gameSlug}`} style={{ fontSize: 12, fontWeight: 700, color: "var(--neon-green)", textDecoration: "none" }}>More {quiz.game} Quizzes →</a>
            <span style={{ color: "var(--text-dim)" }}>·</span>
            <a href="/browse" style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textDecoration: "none" }}>Browse All →</a>
          </div>
        </div>
      )}

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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} role="group" aria-label="Answer options">
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
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    aria-label={`Option ${letters[i]}: ${ans}`}
                    aria-pressed={selected === i}
                    style={{ background: bg, border: `2px solid ${borderColor}`, borderRadius: "var(--radius-sm)", padding: "18px 20px", fontSize: 15, fontWeight: 700, cursor: answered ? "default" : "pointer", fontFamily: "var(--font-body)", color, textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
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
            <div style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 28 }}>
              {user ? `+${score * 10} XP earned!` : "Sign in to save your score and earn XP!"}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
              <button onClick={() => { setCurrent(0); setScore(0); setSelected(null); setAnswered(false); setFinished(false); }} style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "14px 24px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: "var(--bg)" }}>🔄 Play Again</button>
              <a href="/quiz/random" style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "14px 24px", borderRadius: 100, border: "1px solid var(--border)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>⚡ Random Quiz</a>
              <a href="/" style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "14px 24px", borderRadius: 100, border: "1px solid var(--border)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>🏠 Home</a>
            </div>

            {/* After-quiz related links */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Keep Playing</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href={`/games/${gameSlug}`} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>🎮</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>More {quiz.game} Quizzes</span>
                </a>
                <a href="/browse" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>🏆</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Browse All Quizzes</span>
                </a>
                <a href="/#leaderboard" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>👑</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Leaderboard</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}