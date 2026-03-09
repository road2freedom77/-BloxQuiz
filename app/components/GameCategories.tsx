import fs from "fs";
import path from "path";
import { supabase } from "../lib/supabase";

async function getQuizCountByGame(gameName: string): Promise<number> {
  let count = 0;

  // JSON count
  try {
    const dir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      if (data.game === gameName) count++;
    }
  } catch {}

  // Supabase count
  try {
    const { count: generatedCount } = await supabase
      .from("quizzes")
      .select("*", { count: "exact", head: true })
      .eq("game", gameName);
    count += generatedCount || 0;
  } catch {}

  return count;
}

async function getTotalQuizCount(): Promise<number> {
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const jsonCount = fs.readdirSync(quizzesDir).filter(f => f.endsWith(".json")).length;
    const { count: generatedCount } = await supabase
      .from("quizzes")
      .select("*", { count: "exact", head: true });
    return jsonCount + (generatedCount || 0);
  } catch {
    return 0;
  }
}

export default async function GameCategories() {
  const gameList = [
    { name: "Blox Fruits", icon: "⚔️", bg: "rgba(255,60,172,0.12)", badge: "🔥 Hot", badgeColor: "#FF3CAC", badgeBg: "rgba(255,60,172,0.15)", slug: "blox-fruits" },
    { name: "Brookhaven RP", icon: "🏠", bg: "rgba(0,217,255,0.12)", badge: null, slug: "brookhaven-rp" },
    { name: "Adopt Me!", icon: "🐾", bg: "rgba(255,227,71,0.12)", badge: "📈 Trending", badgeColor: "#B84CFF", badgeBg: "rgba(184,76,255,0.15)", slug: "adopt-me" },
    { name: "Tower of Hell", icon: "🗼", bg: "rgba(0,245,160,0.12)", badge: null, slug: "tower-of-hell" },
    { name: "Grow a Garden", icon: "🌱", bg: "rgba(184,76,255,0.12)", badge: "✨ New", badgeColor: "#00F5A0", badgeBg: "rgba(0,245,160,0.15)", slug: "grow-a-garden" },
    { name: "Murder Mystery 2", icon: "🔫", bg: "rgba(255,138,71,0.12)", badge: null, slug: "murder-mystery-2" },
    { name: "Royale High", icon: "👑", bg: "rgba(255,105,180,0.12)", badge: null, slug: "royale-high" },
    { name: "Doors", icon: "🚪", bg: "rgba(255,60,60,0.12)", badge: "🔥 Hot", badgeColor: "#FF3C3C", badgeBg: "rgba(255,60,60,0.15)", slug: "doors" },
    { name: "Arsenal", icon: "🎯", bg: "rgba(255,165,0,0.12)", badge: null, slug: "arsenal" },
    { name: "Anime Fighting Simulator", icon: "🥊", bg: "rgba(0,245,160,0.12)", badge: null, slug: "anime-fighting-simulator" },
    { name: "Berry Avenue", icon: "🍓", bg: "rgba(255,20,147,0.12)", badge: null, slug: "berry-avenue" },
    { name: "Livetopia", icon: "🏖️", bg: "rgba(0,191,255,0.12)", badge: null, slug: "livetopia" },
    { name: "Natural Disaster Survival", icon: "🌪️", bg: "rgba(128,128,128,0.12)", badge: null, slug: "natural-disaster-survival" },
    { name: "Anime Defenders", icon: "🐉", bg: "rgba(148,0,211,0.12)", badge: "📈 Trending", badgeColor: "#9400D3", badgeBg: "rgba(148,0,211,0.15)", slug: "anime-defenders" },
    { name: "Funky Friday", icon: "🎵", bg: "rgba(255,215,0,0.12)", badge: null, slug: "funky-friday" },
    { name: "Kick Off", icon: "⚽", bg: "rgba(0,128,0,0.12)", badge: null, slug: "kick-off" },
    { name: "Bee Swarm Simulator", icon: "🐝", bg: "rgba(255,200,0,0.12)", badge: "✨ New", badgeColor: "#FFB800", badgeBg: "rgba(255,184,0,0.15)", slug: "bee-swarm-simulator" },
    { name: "Dress to Impress", icon: "👗", bg: "rgba(255,105,180,0.12)", badge: "✨ New", badgeColor: "#FF69B4", badgeBg: "rgba(255,105,180,0.15)", slug: "dress-to-impress" },
  ];

  const [games, total] = await Promise.all([
    Promise.all(gameList.map(async g => ({ ...g, quizzes: await getQuizCountByGame(g.name) }))),
    getTotalQuizCount(),
  ]);

  return (
    <div id="games" style={{ position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>{"🎮 Pick a Game"}</h2>
        <a href="/browse" style={{ color: "var(--neon-green)", textDecoration: "none", fontWeight: 800, fontSize: 14 }}>{"View All " + total + "+ →"}</a>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
        {games.map((game) => (
          <a href={"/games/" + game.slug} key={game.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 16px", textAlign: "center", cursor: "pointer", position: "relative", overflow: "hidden", textDecoration: "none", display: "block" }}>
            {game.badge && (
              <span style={{ position: "absolute", top: 10, right: 10, fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 100, textTransform: "uppercase", letterSpacing: 0.5, background: (game as any).badgeBg, color: (game as any).badgeColor }}>{game.badge}</span>
            )}
            <div style={{ width: 56, height: 56, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 12px", background: game.bg }}>{game.icon}</div>
            <h3 style={{ fontSize: 13, fontWeight: 800, marginBottom: 4, color: "var(--text)" }}>{game.name}</h3>
            <p style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>{game.quizzes} Quizzes</p>
          </a>
        ))}
      </div>
    </div>
  );
}