export default function Footer() {
    return (
      <>
        <footer style={{ maxWidth: 1200, margin: "60px auto 0", padding: "40px 24px", borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, position: "relative", zIndex: 1 }}>
          <div>
            <a href="/" style={{ fontFamily: "var(--font-display)", fontSize: 28, textDecoration: "none", background: "var(--gradient-main)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Blox<span style={{ background: "var(--gradient-fire)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Quiz</span>
            </a>
            <p style={{ color: "var(--text-dim)", fontSize: 14, fontWeight: 600, marginTop: 12, lineHeight: 1.6 }}>The #1 Roblox trivia & quiz site. Test your knowledge, earn XP, and compete with friends. Not affiliated with Roblox Corporation.</p>
          </div>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", marginBottom: 14 }}>Popular Games</h4>
            {["Blox Fruits","Brookhaven","Adopt Me!","Tower of Hell","Murder Mystery 2"].map(g => (
              <a key={g} href="#" style={{ display: "block", textDecoration: "none", color: "var(--text-dim)", fontSize: 14, fontWeight: 600, padding: "3px 0" }}>{g}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", marginBottom: 14 }}>Features</h4>
            {["All Quizzes","Daily Challenge","Roblox Codes","Leaderboard","Personality Quizzes"].map(f => (
              <a key={f} href="#" style={{ display: "block", textDecoration: "none", color: "var(--text-dim)", fontSize: 14, fontWeight: 600, padding: "3px 0" }}>{f}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", marginBottom: 14 }}>More</h4>
            {["About","Contact","Privacy Policy","Terms","Advertise"].map(m => (
              <a key={m} href="#" style={{ display: "block", textDecoration: "none", color: "var(--text-dim)", fontSize: 14, fontWeight: 600, padding: "3px 0" }}>{m}</a>
            ))}
          </div>
        </footer>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-dim)", fontWeight: 600, position: "relative", zIndex: 1 }}>
          <span>© 2026 BloxQuiz — Not affiliated with Roblox Corporation</span>
          <span>Made with 💚 for the Roblox community</span>
        </div>
      </>
    );
  }