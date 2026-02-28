export default function PopularQuizzes() {
    const quizzes = [
      { game: "Blox Fruits", difficulty: "Hard", diffColor: "var(--neon-pink)", diffBg: "rgba(255,60,172,0.1)", questions: 15, title: "Ultimate Blox Fruits Expert Quiz", desc: "Can you name every Mythical fruit? Prove you're a true Blox Fruits master.", plays: "8.4K", rating: "4.8", thumb: "linear-gradient(135deg, #1a0a2e, #3d1a5c)", emoji: "🍎⚔️🌊" },
      { game: "Brookhaven", difficulty: "Easy", diffColor: "var(--neon-green)", diffBg: "rgba(0,245,160,0.1)", questions: 10, title: "Brookhaven Secrets You Didn't Know", desc: "Hidden locations, Easter eggs & secret cars. How many do you know?", plays: "12.1K", rating: "4.9", thumb: "linear-gradient(135deg, #0a1628, #1a3a5c)", emoji: "🏠🚗👨‍👩‍👧" },
      { game: "Adopt Me!", difficulty: "Medium", diffColor: "var(--neon-yellow)", diffBg: "rgba(255,227,71,0.1)", questions: 12, title: "Name That Pet! — Adopt Me Edition", desc: "From common to legendary — can you identify every pet from clues alone?", plays: "6.2K", rating: "4.7", thumb: "linear-gradient(135deg, #2a1a0a, #5c3a1a)", emoji: "🐶🦄🥚✨" },
      { game: "All Games", difficulty: "Medium", diffColor: "var(--neon-yellow)", diffBg: "rgba(255,227,71,0.1)", questions: 20, title: "Which Roblox Game Are You?", desc: "Answer 20 personality questions and discover your perfect Roblox game match.", plays: "22.5K", rating: "4.9", thumb: "linear-gradient(135deg, #0a2818, #1a5c3a)", emoji: "🧠🎭❓" },
    ];
  
    return (
      <div id="quizzes" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>🏆 Popular Quizzes</h2>
          <a href="#" style={{ color: "var(--neon-green)", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>See All →</a>
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {quizzes.map((quiz) => (
            <div key={quiz.title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", cursor: "pointer" }}>
              <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, background: quiz.thumb, position: "relative" }}>
                {quiz.emoji}
                <span style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 900, color: "var(--neon-green)" }}>▶ PLAY</span>
              </div>
              <div style={{ padding: "16px 18px 20px" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "rgba(0,217,255,0.1)", color: "var(--neon-blue)" }}>{quiz.game}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: quiz.diffBg, color: quiz.diffColor }}>{quiz.difficulty}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", background: "var(--surface)", color: "var(--text-muted)" }}>{quiz.questions} Q's</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{quiz.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.4 }}>{quiz.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>
                  <span>👥 {quiz.plays} plays</span>
                  <span>⭐ {quiz.rating} rating</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }