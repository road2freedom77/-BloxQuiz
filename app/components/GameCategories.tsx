import fs from "fs";
import path from "path";

function getQuizCountByGame(gameName: string): number {
  try {
    const dir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(dir);
    let count = 0;
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      if (data.game === gameName) count++;
    }
    return count;
  } catch {
    return 0;
  }
}

function getTotalQuizCount(): number {
  try {
    const dir = path.join(process.cwd(), "app/data/quizzes");
    return fs.readdirSync(dir).filter(f => f.endsWith(".json")).length;
  } catch {
    return 0;
  }
}

export default function GameCategories() {
  const games = [
    { name: "Blox Fruits", icon: "⚔️", bg: "rgba(255,60,172,0.12)", badge: "🔥 Hot", badgeColor: "#FF3CAC", badgeBg: "rgba(255,60,172,0.15)", slug: "blox-fruits" },
    { name: "Brookhaven RP", icon: "🏠", bg: "rgba(0,217,255,0.12)", badge: null, slug: "brookhaven" },
    { name: "Adopt Me!", icon: "🐾", bg: "rgba(255,227,71,0.12)", badge: "📈 Trending", badgeColor: "#B84CFF", badgeBg: "rgba(184,76,255,0.15)", slug: "adopt-me" },
    { name: "Tower of Hell", icon: "🗼", bg: "rgba(0,245,160,0.12)", badge: null, slug: "tower-of-hell" },
    { name: "Grow a Garden", icon: "🌱", bg: "rgba(184,76,255,0.12)", badge: "✨ New", badgeColor: "#00F5A0", badgeBg: "rgba(0,245,160,0.15)", slug: "grow-a-garden" },
    { name: "Murder Mystery 2", icon: "🔫", bg: "rgba(255,138,71,0.12)", badge: null, slug: "murder-mystery-2" },
  ].map(g => ({ ...g, quizzes: getQuizCountByGame(g.name) }));

  const total = getTotalQuizCount();

  return (
    <div id="games" style={{ position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>{"🎮 Pick a Game"}</h2>
        <a href="/browse" style={{ color: "var(--neon-green)", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>{"View All " + total + "+ →"}</a>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
        {games.map((game) => (
          <a href={"/games/" + game.slug} key={game.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 16px", textAlign: "center", cursor: "pointer", position: "relative", overflow: "hidden", textDecoration: "none", display: "block" }}>
            {game.badge && (
              <span style={{ position: "absolute", top: 10, right: 10, fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 100, textTransform: "uppercase", letterSpacing: 0.5, background: game.badgeBg, color: game.badgeColor }}>{game.badge}</span>
            )}
            <div style={{ width: 56, height: 56, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 12px", background: game.bg }}>{game.icon}</div>
            <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 4, color: "var(--text)" }}>{game.name}</h3>
            <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>{game.quizzes} Quizzes</p>
          </a>
        ))}
      </div>
    </div>
  );
}