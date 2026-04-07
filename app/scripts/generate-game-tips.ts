/**
 * scripts/generate-game-tips.ts
 * 
 * Generates gameTips and gameRewards for all Roblox games missing them in CodesClient.tsx
 * Saves output to scripts/output/game-tips-generated.json for manual review before deploying
 * 
 * Run: npx tsx scripts/generate-game-tips.ts
 */

import fs from "fs";
import path from "path";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

// Games that already have tips — skip these
const EXISTING_TIPS = new Set([
  "blox-fruits", "adopt-me", "murder-mystery-2", "grow-a-garden",
  "brookhaven-rp", "tower-of-hell", "royale-high", "doors",
  "arsenal", "anime-fighting-simulator", "berry-avenue", "livetopia",
  "natural-disaster-survival", "anime-defenders", "funky-friday",
  "kick-off", "fisch",
]);

// All 96 games in your codes system
const ALL_GAMES: { slug: string; name: string; genre: string }[] = [
  { slug: "3008", name: "3008", genre: "horror" },
  { slug: "99-nights-in-the-forest", name: "99 Nights in the Forest", genre: "survival" },
  { slug: "all-star-tower-defense", name: "All Star Tower Defense", genre: "tower-defense" },
  { slug: "anime-battlegrounds-x", name: "Anime Battlegrounds X", genre: "rpg" },
  { slug: "anime-dimensions-simulator", name: "Anime Dimensions Simulator", genre: "simulator" },
  { slug: "anime-impact-simulator", name: "Anime Impact Simulator", genre: "simulator" },
  { slug: "anime-story", name: "Anime Story", genre: "rpg" },
  { slug: "anime-vanguards", name: "Anime Vanguards", genre: "tower-defense" },
  { slug: "arm-wrestle-simulator", name: "Arm Wrestle Simulator", genre: "simulator" },
  { slug: "attack-on-titan-revolution", name: "Attack on Titan Revolution", genre: "rpg" },
  { slug: "barrys-prison-run", name: "BARRY'S PRISON RUN!", genre: "obby" },
  { slug: "bedwars", name: "BedWars", genre: "shooter" },
  { slug: "bee-swarm-simulator", name: "Bee Swarm Simulator", genre: "simulator" },
  { slug: "blade-ball", name: "Blade Ball", genre: "sports" },
  { slug: "blox-fruits", name: "Blox Fruits", genre: "rpg" },
  { slug: "blue-lock-rivals", name: "Blue Lock: Rivals", genre: "sports" },
  { slug: "break-in", name: "Break In", genre: "horror" },
  { slug: "build-a-boat-for-treasure", name: "Build A Boat For Treasure", genre: "simulator" },
  { slug: "camping", name: "Camping", genre: "horror" },
  { slug: "car-dealership-tycoon", name: "Car Dealership Tycoon", genre: "simulator" },
  { slug: "clicker-simulator-x", name: "Clicker Simulator X", genre: "simulator" },
  { slug: "creatures-of-sonaria", name: "Creatures of Sonaria", genre: "roleplay" },
  { slug: "da-hood", name: "Da Hood", genre: "roleplay" },
  { slug: "dandys-world", name: "Dandy's World", genre: "horror" },
  { slug: "demon-slayer-rpg-2", name: "Demon Slayer RPG 2", genre: "rpg" },
  { slug: "deepwoken", name: "Deepwoken", genre: "rpg" },
  { slug: "dragon-adventures", name: "Dragon Adventures", genre: "roleplay" },
  { slug: "dress-to-impress", name: "Dress to Impress", genre: "fashion" },
  { slug: "driving-empire", name: "Driving Empire", genre: "simulator" },
  { slug: "evade", name: "Evade", genre: "horror" },
  { slug: "fish-it", name: "Fish It!", genre: "simulator" },
  { slug: "flee-the-facility", name: "Flee the Facility", genre: "horror" },
  { slug: "forsaken", name: "Forsaken", genre: "horror" },
  { slug: "fruit-battlegrounds", name: "Fruit Battlegrounds", genre: "rpg" },
  { slug: "ghost-simulator", name: "Ghost Simulator", genre: "simulator" },
  { slug: "grand-piece-online", name: "Grand Piece Online", genre: "rpg" },
  { slug: "heroes-world", name: "Heroes World", genre: "rpg" },
  { slug: "house-tycoon", name: "House Tycoon", genre: "simulator" },
  { slug: "hypershot", name: "Hypershot", genre: "shooter" },
  { slug: "islands", name: "Islands", genre: "simulator" },
  { slug: "jujutsu-infinite", name: "Jujutsu Infinite", genre: "rpg" },
  { slug: "jujutsu-shenanigans", name: "Jujutsu Shenanigans", genre: "rpg" },
  { slug: "kaiju-universe", name: "Kaiju Universe", genre: "rpg" },
  { slug: "king-legacy", name: "King Legacy", genre: "rpg" },
  { slug: "lumber-tycoon-2", name: "Lumber Tycoon 2", genre: "simulator" },
  { slug: "meep-city", name: "MeepCity", genre: "roleplay" },
  { slug: "murder-party", name: "Murder Party", genre: "mystery" },
  { slug: "muscle-legends", name: "Muscle Legends", genre: "simulator" },
  { slug: "my-restaurant", name: "My Restaurant", genre: "simulator" },
  { slug: "my-supermarket", name: "My Supermarket", genre: "simulator" },
  { slug: "ninja-legends", name: "Ninja Legends", genre: "simulator" },
  { slug: "obby-but-youre-on-a-bike", name: "Obby But You're on a Bike", genre: "obby" },
  { slug: "pet-simulator-99", name: "Pet Simulator 99", genre: "simulator" },
  { slug: "pet-simulator-x", name: "Pet Simulator X", genre: "simulator" },
  { slug: "piggy", name: "Piggy", genre: "horror" },
  { slug: "pls-donate", name: "PLS DONATE", genre: "roleplay" },
  { slug: "prison-life", name: "Prison Life", genre: "roleplay" },
  { slug: "project-slayers", name: "Project Slayers", genre: "rpg" },
  { slug: "ragdoll-universe", name: "Ragdoll Universe", genre: "simulator" },
  { slug: "rivals", name: "RIVALS", genre: "shooter" },
  { slug: "ro-ghoul", name: "Ro-Ghoul", genre: "rpg" },
  { slug: "shindo-life", name: "Shindo Life", genre: "rpg" },
  { slug: "slap-battles", name: "Slap Battles", genre: "sports" },
  { slug: "sols-rng", name: "Sol's RNG", genre: "simulator" },
  { slug: "southwest-florida", name: "Southwest Florida", genre: "roleplay" },
  { slug: "speed-run-4", name: "Speed Run 4", genre: "obby" },
  { slug: "squid-game", name: "Squid Game", genre: "horror" },
  { slug: "starving-artists", name: "Starving Artists", genre: "roleplay" },
  { slug: "strongman-simulator", name: "Strongman Simulator", genre: "simulator" },
  { slug: "super-golf", name: "Super Golf", genre: "sports" },
  { slug: "super-striker-league", name: "Super Striker League", genre: "sports" },
  { slug: "survive-the-killer", name: "Survive the Killer", genre: "horror" },
  { slug: "the-strongest-battlegrounds", name: "The Strongest Battlegrounds", genre: "rpg" },
  { slug: "toilet-tower-defense", name: "Toilet Tower Defense", genre: "tower-defense" },
  { slug: "tower-defense-simulator", name: "Tower Defense Simulator", genre: "tower-defense" },
  { slug: "type-soul", name: "Type Soul", genre: "rpg" },
  { slug: "untitled-boxing-game", name: "Untitled Boxing Game", genre: "sports" },
  { slug: "welcome-to-bloxburg", name: "Welcome to Bloxburg", genre: "roleplay" },
  { slug: "work-at-a-pizza-place", name: "Work at a Pizza Place", genre: "roleplay" },
  { slug: "zombie-attack", name: "Zombie Attack", genre: "horror" },
];

const MISSING_GAMES = ALL_GAMES.filter(g => !EXISTING_TIPS.has(g.slug));

async function generateTipsForGame(game: { slug: string; name: string; genre: string }): Promise<{
  tips: string;
  rewards: string[];
} | null> {
  const prompt = `You are writing content for BloxQuiz.gg, a Roblox trivia and tools site.

Write tips and rewards for the Roblox game "${game.name}" (genre: ${game.genre}) for a codes page.

Return ONLY valid JSON with this exact structure:
{
  "tips": "2-3 sentence paragraph explaining when codes are released for this game, what they typically reward, and the best strategy for redeeming them before they expire. Be specific to ${game.name}. Do not use the word 'daily'.",
  "rewards": ["reward type 1", "reward type 2", "reward type 3"]
}

The rewards array should have 3 items describing what codes typically give in ${game.name}.
Keep each reward under 8 words.
Do not include any text outside the JSON.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    console.error(`Failed for ${game.slug}:`, e);
    return null;
  }
}

async function main() {
  console.log(`Generating tips for ${MISSING_GAMES.length} games...`);

  const outputDir = path.join(process.cwd(), "scripts/output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const results: Record<string, { tips: string; rewards: string[] }> = {};
  let success = 0;
  let failed = 0;

  for (const game of MISSING_GAMES) {
    process.stdout.write(`  ${game.slug}... `);
    const result = await generateTipsForGame(game);
    if (result) {
      results[game.slug] = result;
      success++;
      console.log("✓");
    } else {
      failed++;
      console.log("✗ failed");
    }
    // Rate limit pause
    await new Promise(r => setTimeout(r, 300));
  }

  const outputPath = path.join(outputDir, "game-tips-generated.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\nDone. ${success} succeeded, ${failed} failed.`);
  console.log(`Output saved to: ${outputPath}`);
  console.log(`\nReview the file, then paste the entries into CodesClient.tsx gameTips and gameRewards.`);
}

main();