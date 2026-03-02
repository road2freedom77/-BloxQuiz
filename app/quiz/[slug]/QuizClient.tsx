"use client";
import { useState, useRef } from "react";
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

const gameEmojis: Record<string, string> = {
  "Blox Fruits": "⚔️",
  "Brookhaven RP": "🏠",
  "Adopt Me!": "🐾",
  "Tower of Hell": "🗼",
  "Murder Mystery 2": "🔫",
  "Grow a Garden": "🌱",
};

export default function QuizClient({ quiz, slug, faqs }: { quiz: any, slug: string, faqs: any[] }) {
  const { user } = useUser();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const today = new Date().toISOString().split("T")[0];
    const { data: userData } = await supabase
      .from("users")
      .select("streak, last_played")
      .eq("id", user.id)
      .single();

    let newStreak = 1;
    if (userData?.last_played) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const lastPlayedDate = new Date(userData.last_played).toISOString().split("T")[0];
      const yesterdayDate = yesterday.toISOString().split("T")[0];
      if (lastPlayedDate === today) {
        newStreak = userData.streak;
      } else if (lastPlayedDate === yesterdayDate) {
        newStreak = (userData.streak || 0) + 1;
      } else {
        newStreak = 1;
      }
    }

    await supabase.from("users").upsert({
      id: user.id,
      username: user.username || user.firstName || "Anonymous",
      email: user.emailAddresses[0]?.emailAddress,
      streak: newStreak,
      last_played: today,
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

  function generateShareCard() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    // Background
    ctx.fillStyle = "#0B0E17";
    ctx.fillRect(0, 0, 1080, 1080);

    // Neon glow circle
    const gradient = ctx.createRadialGradient(540, 400, 0, 540, 400, 500);
    gradient.addColorStop(0, "rgba(0,245,160,0.12)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Top border accent
    const borderGrad = ctx.createLinearGradient(0, 0, 1080, 0);
    borderGrad.addColorStop(0, "#00F5A0");
    borderGrad.addColorStop(0.5, "#B84CFF");
    borderGrad.addColorStop(1, "#FF3CAC");
    ctx.fillStyle = borderGrad;
    ctx.fillRect(0, 0, 1080, 6);

    // Game emoji
    ctx.font = "120px serif";
    ctx.textAlign = "center";
    ctx.fillText(gameEmojis[quiz.game] || "🎮", 540, 220);

    // Quiz title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";
    const title = quiz.title.length > 40 ? quiz.title.substring(0, 40) + "..." : quiz.title;
    ctx.fillText(title, 540, 300);

    // Score
    ctx.font = "bold 200px Arial";
    const scoreGrad = ctx.createLinearGradient(0, 350, 0, 580);
    scoreGrad.addColorStop(0, "#00F5A0");
    scoreGrad.addColorStop(1, "#B84CFF");
    ctx.fillStyle = scoreGrad;
    ctx.textAlign = "center";
    ctx.fillText(score + "/" + quiz.questions.length, 540, 580);

    // Result label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px Arial";
    ctx.fillText(getResultLabel().label, 540, 660);

    // XP earned
    ctx.fillStyle = "#FFE347";
    ctx.font = "bold 36px Arial";
    ctx.fillText("+" + (score * 10) + " XP earned", 540, 730);

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 780);
    ctx.lineTo(880, 780);
    ctx.stroke();

    // BloxQuiz branding
    ctx.fillStyle = "#00F5A0";
    ctx.font = "bold 48px Arial";
    ctx.fillText("BloxQuiz", 480, 860);
    ctx.fillStyle = "#FF3CAC";
    ctx.fillText(".gg", 620, 860);

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "28px Arial";
    ctx.fillText("Can you beat my score? bloxquiz.gg", 540, 920);

    // Game + difficulty badges
    ctx.fillStyle = "rgba(0,217,255,0.2)";
    roundRect(ctx, 340, 950, 180, 44, 22);
    ctx.fillStyle = "#00D9FF";
    ctx.font = "bold 22px Arial";
    ctx.fillText(quiz.game, 430, 978);

    ctx.fillStyle = "rgba(0,245,160,0.2)";
    roundRect(ctx, 540, 950, 160, 44, 22);
    ctx.fillStyle = "#00F5A0";
    ctx.font = "bold 22px Arial";
    ctx.fillText(quiz.difficulty, 620, 978);
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }

  async function shareScore() {
    setSharing(true);
    generateShareCard();
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      // Try Web Share API first (mobile)
      if (navigator.share && navigator.canShare({ files: [new File([blob], "bloxquiz-score.png", { type: "image/png" })] })) {
        try {
          await navigator.share({
            title: "I scored " + score + "/" + quiz.questions.length + " on BloxQuiz!",
            text: "Can you beat my score? Play at bloxquiz.gg",
            files: [new File([blob], "bloxquiz-score.png", { type: "image/png" })]
          });
          setShared(true);
        } catch (e) {
          downloadCard(canvas);
        }
      } else {
        // Fallback: download image
        downloadCard(canvas);
      }
      setSharing(false);
    });
  }

  function downloadCard(canvas: HTMLCanvasElement) {
    const link = document.createElement("a");
    link.download = "bloxquiz-score.png";
    link.href = canvas.toDataURL();
    link.click();
    setShared(true);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

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
            <a href={"/games/" + gameSlug} style={{ fontSize: 12, fontWeight: 700, color: "var(--neon-green)", textDecoration: "none" }}>{"More " + quiz.game + " Quizzes →"}</a>
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
                    aria-label={"Option " + letters[i] + ": " + ans}
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
              {user ? "+" + (score * 10) + " XP earned!" : "Sign in to save your score and earn XP!"}
            </div>

            {/* Share Card Button */}
            <div style={{ marginBottom: 24 }}>
              <button
                onClick={shareScore}
                disabled={sharing}
                style={{
                  background: shared ? "var(--surface)" : "linear-gradient(135deg, #B84CFF, #FF3CAC)",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 16,
                  padding: "16px 36px",
                  borderRadius: 100,
                  border: shared ? "1px solid var(--border)" : "none",
                  cursor: sharing ? "default" : "pointer",
                  fontFamily: "var(--font-body)",
                  WebkitTextFillColor: "#fff",
                  opacity: sharing ? 0.7 : 1,
                  boxShadow: shared ? "none" : "0 4px 24px rgba(184,76,255,0.4)"
                }}
              >
                {sharing ? "⏳ Generating..." : shared ? "✅ Card Downloaded!" : "📸 Share My Score"}
              </button>
              <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, marginTop: 8 }}>
                Download your score card and share on TikTok, Discord or Reddit!
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
              <button onClick={() => { setCurrent(0); setScore(0); setSelected(null); setAnswered(false); setFinished(false); setShared(false); }} style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "14px 24px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", WebkitTextFillColor: "var(--bg)" }}>
                {"🔄 Play Again"}
              </button>
              <a href="/quiz/random" style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "14px 24px", borderRadius: 100, border: "1px solid var(--border)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                {"⚡ Random Quiz"}
              </a>
              <a href="/" style={{ background: "var(--surface)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "14px 24px", borderRadius: 100, border: "1px solid var(--border)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                {"🏠 Home"}
              </a>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Keep Playing</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href={"/games/" + gameSlug} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 18px", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>🎮</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{"More " + quiz.game + " Quizzes"}</span>
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

      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>{"❓ Frequently Asked Questions"}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--text)", textAlign: "left" }}>
                {faq.question}
                <span style={{ fontSize: 18, color: "var(--text-muted)", flexShrink: 0, marginLeft: 12 }}>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 20px 16px", fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.6 }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}