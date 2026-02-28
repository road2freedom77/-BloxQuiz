export default function Leaderboard() {
    const players = [
      { rank: 1, name: "xX_BloxKing_Xx", quizzes: 142, score: "9,840", avatar: "👑", avatarBg: "rgba(255,227,71,0.15)", rankColor: "var(--neon-yellow)" },
      { rank: 2, name: "FruitMaster2026", quizzes: 128, score: "8,720", avatar: "🥈", avatarBg: "rgba(192,192,192,0.15)", rankColor: "#C0C0C0" },
      { rank: 3, name: "RobloxTrivia_Queen", quizzes: 115, score: "7,950", avatar: "🥉", avatarBg: "rgba(205,127,50,0.15)", rankColor: "#CD7F32" },
      { rank: 4, name: "BrookhavenPro", quizzes: 98, score: "6,380", avatar: "😎", avatarBg: "var(--surface)", rankColor: "var(--text-dim)" },
      { rank: 5, name: "AdoptMeExpert", quizzes: 87, score: "5,210", avatar: "🎯", avatarBg: "var(--surface)", rankColor: "var(--text-dim)" },
    ];
  
    return (
      <div id="leaderboard" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>👑 Top Players This Week</h2>
          <a href="#" style={{ color: "var(--neon-green)", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>Full Leaderboard →</a>
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            {players.map((player, i) => (
              <div key={player.name} style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 100px", alignItems: "center", padding: "14px 24px", borderBottom: i < players.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: player.rankColor }}>{player.rank}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: player.avatarBg }}>{player.avatar}</div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{player.name}</div>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700 }}>{player.quizzes} quizzes</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, background: "var(--gradient-main)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{player.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }