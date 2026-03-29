import { supabaseAdmin } from "../lib/supabase";
import BrowseClient from "./BrowseClient";

const INITIAL_COUNT = 48;

const gameHubs = [
  { name: "Blox Fruits", slug: "blox-fruits", emoji: "⚔️" },
  { name: "Brookhaven RP", slug: "brookhaven-rp", emoji: "🏠" },
  { name: "Adopt Me!", slug: "adopt-me", emoji: "🐾" },
  { name: "Tower of Hell", slug: "tower-of-hell", emoji: "🗼" },
  { name: "Murder Mystery 2", slug: "murder-mystery-2", emoji: "🔫" },
  { name: "Grow a Garden", slug: "grow-a-garden", emoji: "🌱" },
  { name: "Royale High", slug: "royale-high", emoji: "👑" },
  { name: "Doors", slug: "doors", emoji: "🚪" },
  { name: "Arsenal", slug: "arsenal", emoji: "🎯" },
  { name: "Anime Fighting Simulator", slug: "anime-fighting-simulator", emoji: "🥊" },
  { name: "Berry Avenue", slug: "berry-avenue", emoji: "🍓" },
  { name: "Livetopia", slug: "livetopia", emoji: "🏖️" },
  { name: "Natural Disaster Survival", slug: "natural-disaster-survival", emoji: "🌪️" },
  { name: "Anime Defenders", slug: "anime-defenders", emoji: "🐉" },
  { name: "Funky Friday", slug: "funky-friday", emoji: "🎵" },
  { name: "Kick Off", slug: "kick-off", emoji: "⚽" },
  { name: "Bee Swarm Simulator", slug: "bee-swarm-simulator", emoji: "🐝" },
  { name: "Dress to Impress", slug: "dress-to-impress", emoji: "👗" },
  { name: "Fisch", slug: "fisch", emoji: "🎣" },
  { name: "RIVALS", slug: "rivals", emoji: "⚔️" },
  { name: "The Strongest Battlegrounds", slug: "the-strongest-battlegrounds", emoji: "💥" },
  { name: "Jujutsu Shenanigans", slug: "jujutsu-shenanigans", emoji: "🥋" },
  { name: "Blade Ball", slug: "blade-ball", emoji: "🔵" },
  { name: "Attack on Titan Revolution", slug: "attack-on-titan-revolution", emoji: "⚡" },
  { name: "Jujutsu Infinite", slug: "jujutsu-infinite", emoji: "🌀" },
  { name: "Grand Piece Online", slug: "grand-piece-online", emoji: "🏴‍☠️" },
  { name: "Anime Battlegrounds X", slug: "anime-battlegrounds-x", emoji: "🌟" },
  { name: "Fruit Battlegrounds", slug: "fruit-battlegrounds", emoji: "🍑" },
  { name: "Project Slayers", slug: "project-slayers", emoji: "🗡️" },
  { name: "Demon Slayer RPG 2", slug: "demon-slayer-rpg-2", emoji: "🔥" },
  { name: "King Legacy", slug: "king-legacy", emoji: "👑" },
  { name: "Untitled Boxing Game", slug: "untitled-boxing-game", emoji: "🥊" },
  { name: "Shindo Life", slug: "shindo-life", emoji: "🍃" },
  { name: "Ro-Ghoul", slug: "ro-ghoul", emoji: "👁️" },
  { name: "Type Soul", slug: "type-soul", emoji: "⚔️" },
  { name: "Deepwoken", slug: "deepwoken", emoji: "🌊" },
  { name: "Evade", slug: "evade", emoji: "👻" },
  { name: "Dandy's World", slug: "dandys-world", emoji: "🎪" },
  { name: "3008", slug: "3008", emoji: "🏬" },
  { name: "Flee the Facility", slug: "flee-the-facility", emoji: "🏃" },
  { name: "Forsaken", slug: "forsaken", emoji: "💀" },
  { name: "Piggy", slug: "piggy", emoji: "🐷" },
  { name: "Survive the Killer", slug: "survive-the-killer", emoji: "🔪" },
  { name: "Camping", slug: "camping", emoji: "⛺" },
  { name: "Murder Party", slug: "murder-party", emoji: "🎭" },
  { name: "99 Nights in the Forest", slug: "99-nights-in-the-forest", emoji: "🌲" },
  { name: "Sol's RNG", slug: "sols-rng", emoji: "🎲" },
  { name: "Pet Simulator X", slug: "pet-simulator-x", emoji: "🐾" },
  { name: "Pet Simulator 99", slug: "pet-simulator-99", emoji: "🐶" },
  { name: "Dragon Adventures", slug: "dragon-adventures", emoji: "🐉" },
  { name: "Ghost Simulator", slug: "ghost-simulator", emoji: "👻" },
  { name: "Muscle Legends", slug: "muscle-legends", emoji: "💪" },
  { name: "Strongman Simulator", slug: "strongman-simulator", emoji: "🏋️" },
  { name: "Ninja Legends", slug: "ninja-legends", emoji: "🥷" },
  { name: "Anime Impact Simulator", slug: "anime-impact-simulator", emoji: "⭐" },
  { name: "Anime Dimensions Simulator", slug: "anime-dimensions-simulator", emoji: "✨" },
  { name: "Fish It!", slug: "fish-it", emoji: "🎣" },
  { name: "Zombie Attack", slug: "zombie-attack", emoji: "🧟" },
  { name: "My Supermarket", slug: "my-supermarket", emoji: "🛒" },
  { name: "Clicker Simulator X", slug: "clicker-simulator-x", emoji: "👆" },
  { name: "Arm Wrestle Simulator", slug: "arm-wrestle-simulator", emoji: "💪" },
  { name: "Anime Story", slug: "anime-story", emoji: "📖" },
  { name: "Welcome to Bloxburg", slug: "welcome-to-bloxburg", emoji: "🏡" },
  { name: "MeepCity", slug: "meep-city", emoji: "🌆" },
  { name: "Da Hood", slug: "da-hood", emoji: "🏙️" },
  { name: "Southwest Florida", slug: "southwest-florida", emoji: "🌴" },
  { name: "Prison Life", slug: "prison-life", emoji: "🔒" },
  { name: "Creatures of Sonaria", slug: "creatures-of-sonaria", emoji: "🦕" },
  { name: "PLS DONATE", slug: "pls-donate", emoji: "💸" },
  { name: "My Restaurant", slug: "my-restaurant", emoji: "🍽️" },
  { name: "Starving Artists", slug: "starving-artists", emoji: "🎨" },
  { name: "Squid Game", slug: "squid-game", emoji: "🦑" },
  { name: "Speed Run 4", slug: "speed-run-4", emoji: "🏃" },
  { name: "Obby But You're on a Bike", slug: "obby-but-youre-on-a-bike", emoji: "🚲" },
  { name: "BARRY'S PRISON RUN!", slug: "barrys-prison-run", emoji: "🏃" },
  { name: "Tower Defense Simulator", slug: "tower-defense-simulator", emoji: "🗼" },
  { name: "Anime Vanguards", slug: "anime-vanguards", emoji: "🛡️" },
  { name: "Toilet Tower Defense", slug: "toilet-tower-defense", emoji: "🚽" },
  { name: "All Star Tower Defense", slug: "all-star-tower-defense", emoji: "⭐" },
  { name: "Blue Lock: Rivals", slug: "blue-lock-rivals", emoji: "⚽" },
  { name: "Driving Empire", slug: "driving-empire", emoji: "🚗" },
  { name: "Super Striker League", slug: "super-striker-league", emoji: "⚽" },
  { name: "Hypershot", slug: "hypershot", emoji: "🎯" },
  { name: "Build A Boat For Treasure", slug: "build-a-boat-for-treasure", emoji: "⛵" },
  { name: "Work at a Pizza Place", slug: "work-at-a-pizza-place", emoji: "🍕" },
  { name: "Lumber Tycoon 2", slug: "lumber-tycoon-2", emoji: "🪵" },
  { name: "Islands", slug: "islands", emoji: "🏝️" },
  { name: "Break In", slug: "break-in", emoji: "🚨" },
  { name: "Super Golf", slug: "super-golf", emoji: "⛳" },
  { name: "Kaiju Universe", slug: "kaiju-universe", emoji: "🦖" },
  { name: "Car Dealership Tycoon", slug: "car-dealership-tycoon", emoji: "🚘" },
  { name: "Heroes World", slug: "heroes-world", emoji: "🦸" },
  { name: "Slap Battles", slug: "slap-battles", emoji: "👋" },
  { name: "BedWars", slug: "bedwars", emoji: "🛏️" },
  { name: "Ragdoll Universe", slug: "ragdoll-universe", emoji: "🪆" },
  { name: "House Tycoon", slug: "house-tycoon", emoji: "🏠" },
];

export const revalidate = 3600;

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { difficulty?: string; sort?: string };
}) {
  const difficulty = searchParams.difficulty || "all";

  let query = supabaseAdmin
    .from("quizzes")
    .select("slug, title, game, difficulty, questions, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(INITIAL_COUNT);

  if (difficulty !== "all") {
    query = query.ilike("difficulty", difficulty);
  }

  const { data: initialQuizzes } = await query;
  const quizzes = initialQuizzes || [];

  const { count: totalCount } = await supabaseAdmin
    .from("quizzes")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { data: gameCountData } = await supabaseAdmin
    .from("quizzes")
    .select("game")
    .eq("status", "published");
  const gameCount = new Set(gameCountData?.map((q) => q.game)).size;

  return (
    <>
      <style>{`#ssr-quiz-grid { display: none; } @media (scripting: none) { #ssr-quiz-grid { display: block; } }`}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, marginBottom: 8 }}>
          {"🎮 All Roblox Quizzes"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 32 }}>
          {totalCount} quizzes across {gameCount} Roblox games — test your knowledge and climb the leaderboard.
        </p>

        <div id="ssr-quiz-grid">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
            {quizzes.map((quiz) => (
              <a
                key={quiz.slug}
                href={"/quiz/" + quiz.slug}
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px", textDecoration: "none", display: "block" }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--neon-blue)", marginBottom: 6, textTransform: "uppercase" }}>
                  {quiz.game}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>
                  {quiz.title}
                </h3>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>
                  {quiz.difficulty} · {Array.isArray(quiz.questions) ? quiz.questions.length : quiz.questions} questions
                </div>
              </a>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 40 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 8 }}>
            {"🎮 Browse by Game"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, marginBottom: 24 }}>
            Each game hub has all quizzes, free codes, and live player stats in one place.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {gameHubs.map(({ name, slug, emoji }) => (
              <a
                key={slug}
                href={"/games/" + slug}
                style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", textDecoration: "none" }}
              >
                <span style={{ fontSize: 22 }}>{emoji}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>{name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{"View Hub →"}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <BrowseClient
        initialQuizzes={quizzes}
        totalCount={totalCount || 0}
        gameHubs={gameHubs}
        initialDifficulty={difficulty}
        initialSort="popular"
      />
    </>
  );
}