export default function GameCategories() {
    const games = [
      { name: "Blox Fruits", quizzes: 42, icon: "⚔️", grad: "linear-gradient(135deg,#FF3CAC,#FF8A47)", bg: "rgba(255,60,172,0.12)", badge: "🔥 Hot", badgeColor: "#FF3CAC", badgeBg: "rgba(255,60,172,0.15)" },
      { name: "Brookhaven", quizzes: 28, icon: "🏠", grad: "linear-gradient(135deg,#00D9FF,#B84CFF)", bg: "rgba(0,217,255,0.12)", badge: null },
      { name: "Adopt Me!", quizzes: 35, icon: "🐾", grad: "linear-gradient(135deg,#FFE347,#FF8A47)", bg: "rgba(255,227,71,0.12)", badge: "📈 Trending", badgeColor: "#B84CFF", badgeBg: "rgba(184,76,255,0.15)" },
      { name: "Tower of Hell", quizzes: 18, icon: "🗼", grad: "linear-gradient(135deg,#00F5A0,#00D9FF)", bg: "rgba(0,245,160,0.12)", badge: null },
      { name: "Grow a Garden", quizzes: 12, icon: "🌱", grad: "linear-gradient(135deg,#B84CFF,#FF3CAC)", bg: "rgba(184,76,255,0.12)", badge: "✨ New", badgeColor: "#00F5A0", badgeBg: "rgba(0,245,160,0.15)" },
      { name: "Murder Mystery 2", quizzes: 22, icon: "🔫", grad: "linear-gradient(135deg,#FF3CAC,#FF8A47)", bg: "rgba(255,138,71,0.12)", badge: null },
    ];
  
    return (
      <div id="games" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>🎮 Pick a Game</h2>
          <a href="#" style={{ color: "var(--neon-green)", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>View All 50+ →</a>
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
          {games.map((game) => (
            <div key={game.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 16px", textAlign: "center", cursor: "pointer", position: "relative", overflow: "hidden" }}>
              {game.badge && (
                <span style={{ position: "absolute", top: 10, right: 10, fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 100, textTransform: "uppercase", letterSpacing: 0.5, background: game.badgeBg, color: game.badgeColor }}>{game.badge}</span>
              )}
              <div style={{ width: 56, height: 56, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 12px", background: game.bg }}>{game.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{game.name}</h3>
              <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>{game.quizzes} Quizzes</p>
            </div>
          ))}
        </div>
      </div>
    );
  }