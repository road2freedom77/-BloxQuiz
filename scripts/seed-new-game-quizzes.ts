import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// 77 new games ordered by player count (from SQL results)
const GAMES = [
  { slug: "fish-it",                     name: "Fish It!",                      topics: "fishing mechanics, fish types, rods, bait, locations, rare catches, upgrades" },
  { slug: "99-nights-in-the-forest",     name: "99 Nights in the Forest",       topics: "survival, night cycles, monsters, crafting, resources, shelter, forest dangers" },
  { slug: "rivals",                       name: "RIVALS",                        topics: "weapons, maps, game modes, mechanics, ranked, abilities, movement" },
  { slug: "jujutsu-shenanigans",         name: "Jujutsu Shenanigans",           topics: "techniques, characters, moves, cursed energy, domains, abilities, combos" },
  { slug: "dandys-world",                name: "Dandy's World",                  topics: "characters, mechanics, floors, toons, dangers, items, survival strategies" },
  { slug: "forsaken",                     name: "Forsaken",                      topics: "weapons, maps, gameplay, modes, mechanics, kills, abilities" },
  { slug: "the-strongest-battlegrounds", name: "The Strongest Battlegrounds",   topics: "characters, moves, abilities, combos, transformations, mechanics, fights" },
  { slug: "anime-vanguards",             name: "Anime Vanguards",               topics: "units, upgrades, waves, traits, summons, tier lists, special abilities" },
  { slug: "pet-simulator-99",            name: "Pet Simulator 99",              topics: "pets, eggs, enchants, biomes, trading, chest areas, exclusives" },
  { slug: "sols-rng",                     name: "Sol's RNG",                     topics: "auras, odds, mechanics, rolls, luck, items, potions" },
  { slug: "king-legacy",                 name: "King Legacy",                   topics: "fruits, swords, fighting styles, islands, bosses, races, abilities" },
  { slug: "evade",                        name: "Evade",                         topics: "entities, maps, mechanics, power-ups, survival, rounds, items" },
  { slug: "all-star-tower-defense",      name: "All Star Tower Defense",        topics: "units, summons, upgrades, maps, modes, gems, tier lists" },
  { slug: "creatures-of-sonaria",        name: "Creatures of Sonaria",          topics: "creatures, abilities, elements, biomes, mutations, taming, lore" },
  { slug: "flee-the-facility",           name: "Flee the Facility",             topics: "maps, roles, hacking, freezing, escaping, beast abilities, items" },
  { slug: "hypershot",                   name: "Hypershot",                     topics: "weapons, mechanics, movement, maps, game modes, abilities, ranks" },
  { slug: "pls-donate",                  name: "PLS DONATE",                    topics: "booths, donation mechanics, stands, Robux, game history, devs, events" },
  { slug: "welcome-to-bloxburg",         name: "Welcome to Bloxburg",           topics: "jobs, houses, building, moods, skills, money, locations" },
  { slug: "blade-ball",                  name: "Blade Ball",                    topics: "abilities, ball mechanics, parrying, swords, upgrades, maps, timing" },
  { slug: "attack-on-titan-revolution",  name: "Attack on Titan Revolution",    topics: "ODM gear, titans, skills, maps, story, characters, abilities" },
  { slug: "barrys-prison-run",           name: "BARRY'S PRISON RUN!",           topics: "sections, traps, Barry, escape mechanics, obstacles, items, secrets" },
  { slug: "driving-empire",             name: "Driving Empire",                topics: "cars, races, mechanics, maps, customization, money, events" },
  { slug: "blue-lock-rivals",           name: "Blue Lock: Rivals",             topics: "skills, positions, moves, mechanics, teams, ego, attributes" },
  { slug: "build-a-boat-for-treasure",  name: "Build A Boat For Treasure",     topics: "materials, building, obstacles, chest mechanics, gold, blocks, traps" },
  { slug: "grand-piece-online",         name: "Grand Piece Online",            topics: "fruits, islands, bosses, races, fighting styles, accessories, seas" },
  { slug: "dragon-adventures",          name: "Dragon Adventures",             topics: "dragons, elements, biomes, breeding, abilities, quests, eggs" },
  { slug: "piggy",                       name: "Piggy",                         topics: "chapters, maps, characters, skins, lore, escape mechanics, traps" },
  { slug: "3008",                        name: "3008",                          topics: "employees, items, survival, day cycles, food, building, mechanics" },
  { slug: "prison-life",                name: "Prison Life",                   topics: "roles, escape routes, items, mechanics, guards, criminals, weapons" },
  { slug: "untitled-boxing-game",       name: "Untitled Boxing Game",          topics: "moves, combos, gloves, mechanics, ranking, training, blocks" },
  { slug: "slap-battles",              name: "Slap Battles",                  topics: "gloves, abilities, arenas, mechanics, badges, secrets, strategies" },
  { slug: "survive-the-killer",        name: "Survive the Killer",            topics: "killers, maps, items, hiding spots, escape mechanics, survivors, rewards" },
  { slug: "jujutsu-infinite",          name: "Jujutsu Infinite",              topics: "techniques, characters, clans, quests, domains, abilities, grades" },
  { slug: "tower-defense-simulator",   name: "Tower Defense Simulator",       topics: "towers, waves, maps, difficulties, gems, upgrades, game modes" },
  { slug: "work-at-a-pizza-place",     name: "Work at a Pizza Place",         topics: "jobs, roles, money, house upgrades, mechanics, items, tips" },
  { slug: "fruit-battlegrounds",       name: "Fruit Battlegrounds",           topics: "fruits, abilities, moves, combos, mechanics, bosses, upgrades" },
  { slug: "car-dealership-tycoon",     name: "Car Dealership Tycoon",         topics: "cars, money, upgrades, mechanics, showroom, customers, events" },
  { slug: "southwest-florida",         name: "Southwest Florida",             topics: "roleplay, locations, jobs, vehicles, mechanics, updates, secrets" },
  { slug: "deepwoken",                 name: "Deepwoken",                     topics: "mantras, talents, weapons, races, guilds, depths, erosion" },
  { slug: "break-in",                  name: "Break In",                      topics: "story, characters, roles, waves, mechanics, items, endings" },
  { slug: "toilet-tower-defense",      name: "Toilet Tower Defense",          topics: "units, waves, toilets, upgrades, maps, summons, abilities" },
  { slug: "muscle-legends",            name: "Muscle Legends",                topics: "training, strength, pets, zones, mythical items, potion, prestige" },
  { slug: "da-hood",                   name: "Da Hood",                       topics: "mechanics, money, weapons, locations, gangs, reputation, items" },
  { slug: "arm-wrestle-simulator",     name: "Arm Wrestle Simulator",         topics: "strength, pets, rebirth, items, zones, mechanics, upgrades" },
  { slug: "obby-but-youre-on-a-bike",  name: "Obby But You're on a Bike",    topics: "stages, bike mechanics, obstacles, checkpoints, tips, speed, secrets" },
  { slug: "shindo-life",               name: "Shindo Life",                   topics: "bloodlines, elements, modes, tailed beasts, villages, abilities, moves" },
  { slug: "lumber-tycoon-2",           name: "Lumber Tycoon 2",               topics: "wood types, tools, money, locations, blueprints, vehicles, axes" },
  { slug: "pet-simulator-x",          name: "Pet Simulator X",               topics: "pets, eggs, trading, zones, exclusives, rainbow pets, enchants" },
  { slug: "strongman-simulator",       name: "Strongman Simulator",           topics: "strength, items, zones, pets, prestige, bosses, upgrades" },
  { slug: "ninja-legends",            name: "Ninja Legends",                 topics: "pets, islands, ninjitsu, prestige, elements, training, upgrades" },
  { slug: "islands",                   name: "Islands",                       topics: "resources, crafting, mobs, machines, trading, totems, biomes" },
  { slug: "kaiju-universe",           name: "Kaiju Universe",                topics: "kaijus, attacks, maps, evolution, abilities, grinding, lore" },
  { slug: "speed-run-4",              name: "Speed Run 4",                   topics: "stages, mechanics, obstacles, records, tips, sections, jump types" },
  { slug: "type-soul",                name: "Type Soul",                     topics: "factions, abilities, grades, clans, weapons, mechanics, progression" },
  { slug: "zombie-attack",            name: "Zombie Attack",                 topics: "waves, weapons, maps, zombie types, upgrades, coins, bosses" },
  { slug: "my-restaurant",            name: "My Restaurant",                 topics: "roles, cooking, customers, money, upgrades, mechanics, items" },
  { slug: "super-golf",               name: "Super Golf",                    topics: "courses, mechanics, shots, obstacles, clubs, maps, tips" },
  { slug: "anime-dimensions-simulator", name: "Anime Dimensions Simulator",  topics: "units, dimensions, summons, upgrades, quests, tier list, abilities" },
  { slug: "ro-ghoul",                 name: "Ro-Ghoul",                      topics: "factions, kagune, RC cells, maps, bosses, masks, mechanics" },
  { slug: "murder-party",             name: "Murder Party",                  topics: "roles, maps, mechanics, items, strategies, rounds, detective" },
  { slug: "project-slayers",          name: "Project Slayers",               topics: "breathing styles, clans, demons, progression, quests, bosses, items" },
  { slug: "starving-artists",         name: "Starving Artists",              topics: "painting, pixel art, selling, mechanics, canvas, stalls, Robux" },
  { slug: "meep-city",                name: "MeepCity",                      topics: "meeps, fishing, parties, houses, minigames, coins, items" },
  { slug: "super-striker-league",     name: "Super Striker League",          topics: "positions, abilities, mechanics, ball control, teams, power shots, leagues" },
  { slug: "heroes-world",             name: "Heroes World",                  topics: "heroes, abilities, quests, mechanics, upgrades, bosses, lore" },
  { slug: "anime-story",              name: "Anime Story",                   topics: "characters, progression, moves, quests, worlds, abilities, bosses" },
  { slug: "my-supermarket",           name: "My Supermarket",                topics: "items, customers, money, upgrades, shelves, mechanics, suppliers" },
  { slug: "camping",                  name: "Camping",                       topics: "stories, maps, characters, mechanics, secrets, endings, survival" },
  { slug: "ghost-simulator",          name: "Ghost Simulator",               topics: "pets, ghosts, zones, vacuums, upgrades, bosses, mechanics" },
  { slug: "anime-battlegrounds-x",    name: "Anime Battlegrounds X",         topics: "characters, abilities, ultimates, mechanics, combos, maps, upgrades" },
  { slug: "ragdoll-universe",         name: "Ragdoll Universe",              topics: "maps, mechanics, ragdoll physics, minigames, items, badges, modes" },
  { slug: "clicker-simulator-x",      name: "Clicker Simulator X",           topics: "clicking, pets, zones, upgrades, prestige, bosses, items" },
  { slug: "house-tycoon",             name: "House Tycoon",                  topics: "building, money, upgrades, mechanics, rooms, items, progression" },
  { slug: "squid-game",               name: "Squid Game",                    topics: "mini-games, rules, red light green light, mechanics, survival, rounds, items" },
  { slug: "demon-slayer-rpg-2",       name: "Demon Slayer RPG 2",            topics: "breathing styles, demons, clans, quests, bosses, abilities, progression" },
  { slug: "anime-impact-simulator",   name: "Anime Impact Simulator",        topics: "units, upgrades, summons, stages, gems, mechanics, tier list" },
  { slug: "bedwars",                  name: "BedWars",                       topics: "items, bed defense, mechanics, maps, teams, upgrades, strategies" },
];

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateQuiz(game: { slug: string; name: string; topics: string }) {
  const prompt = `Generate an Easy difficulty 10-question multiple choice trivia quiz about the Roblox game "${game.name}".

Topics to cover: ${game.topics}

Rules:
- Each question must have exactly 4 answer options
- Only one answer is correct
- Questions should be factually accurate about the actual Roblox game
- Difficulty: Easy (basic facts any casual player would know)
- Make questions specific and interesting, not too vague
- Make the title unique and descriptive (not just "${game.name} Quiz")
- Include a 1-2 sentence intro describing what the quiz covers

Respond with ONLY a valid JSON object, no markdown, no extra text:
{
  "title": "Quiz title here",
  "intro": "Short intro sentence here.",
  "angle": "short topic angle (e.g. 'basics', 'weapons', 'pets')",
  "questions": [
    {
      "q": "Question text here?",
      "a": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}

The "correct" field is the 0-based index of the correct answer.`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = (response.content[0] as { text: string }).text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function seedAll() {
  // Get already-seeded game slugs to allow resuming
  const { data: existing } = await supabase
    .from("quizzes")
    .select("game")
    .eq("difficulty", "Easy");

  const alreadySeeded = new Set((existing || []).map((r: { game: string }) => r.game));
  const toSeed = GAMES.filter((g) => !alreadySeeded.has(g.name));

  console.log(`${alreadySeeded.size} games already seeded, ${toSeed.length} remaining...\n`);

  let success = 0;
  let failed = 0;

  for (const game of toSeed) {
    try {
      console.log(`Generating: ${game.name}...`);
      const quiz = await generateQuiz(game);

      const quizSlug = `${game.slug}-easy-${makeSlug(quiz.angle || "basics")}`;

      const { error } = await supabase.from("quizzes").insert({
        slug: quizSlug,
        title: quiz.title,
        game: game.name,
        difficulty: "Easy",
        angle: quiz.angle || null,
        intro: quiz.intro || null,
        questions: quiz.questions,
        status: "published",
        published_at: new Date().toISOString(),
        source: "seeded",
      });

      if (error) {
        console.error(`  ❌ DB error for ${game.name}: ${error.message}`);
        failed++;
      } else {
        console.log(`  ✅ ${quiz.title} → /quiz/${quizSlug}`);
        success++;
      }
    } catch (err) {
      console.error(`  ❌ Failed ${game.name}:`, err);
      failed++;
    }

    // Rate limit buffer
    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed`);
}

seedAll().catch(console.error);