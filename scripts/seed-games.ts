import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const NEW_GAMES = [
  // Fighting / Battlegrounds
  { universe_id: 6035872082, place_id: 17625359962, slug: "rivals",                      name: "RIVALS",                        emoji: "⚔️", genre: "shooter" },
  { universe_id: 3808081382, place_id: 10449761463, slug: "the-strongest-battlegrounds", name: "The Strongest Battlegrounds",    emoji: "💥", genre: "rpg" },
  { universe_id: 3508322461, place_id: 9391468976,  slug: "jujutsu-shenanigans",         name: "Jujutsu Shenanigans",           emoji: "🥋", genre: "rpg" },
  { universe_id: 4777817887, place_id: 13772394625, slug: "blade-ball",                  name: "Blade Ball",                    emoji: "🔵", genre: "rpg" },
  { universe_id: 4658598196, place_id: 13379208636, slug: "attack-on-titan-revolution",  name: "Attack on Titan Revolution",    emoji: "⚡", genre: "rpg" },
  { universe_id: 3808223175, place_id: 10450270085, slug: "jujutsu-infinite",            name: "Jujutsu Infinite",              emoji: "🌀", genre: "rpg" },
  { universe_id: 648454481,  place_id: 1730877806,  slug: "grand-piece-online",          name: "Grand Piece Online",            emoji: "🏴‍☠️", genre: "rpg" },
  { universe_id: 2973961838, place_id: 7655489843,  slug: "anime-battlegrounds-x",       name: "Anime Battlegrounds X",         emoji: "🌟", genre: "rpg" },
  { universe_id: 3457700596, place_id: 9224601490,  slug: "fruit-battlegrounds",         name: "Fruit Battlegrounds",           emoji: "🍑", genre: "rpg" },
  { universe_id: 2142948266, place_id: 5956785391,  slug: "project-slayers",             name: "Project Slayers",               emoji: "🗡️", genre: "rpg" },
  { universe_id: 1579352805, place_id: 4734949248,  slug: "demon-slayer-rpg-2",          name: "Demon Slayer RPG 2",            emoji: "🔥", genre: "rpg" },
  { universe_id: 1451439645, place_id: 4520749081,  slug: "king-legacy",                 name: "King Legacy",                   emoji: "👑", genre: "rpg" },
  { universe_id: 4730278139, place_id: 13621938427, slug: "untitled-boxing-game",        name: "Untitled Boxing Game",          emoji: "🥊", genre: "rpg" },
  { universe_id: 1511883870, place_id: 4616652839,  slug: "shindo-life",                 name: "Shindo Life",                   emoji: "🍃", genre: "rpg" },
  { universe_id: 380704901,  place_id: 914010731,   slug: "ro-ghoul",                    name: "Ro-Ghoul",                      emoji: "👁️", genre: "rpg" },
  { universe_id: 4871329703, place_id: 14067600077, slug: "type-soul",                   name: "Type Soul",                     emoji: "⚔️", genre: "rpg" },
  { universe_id: 1359573625, place_id: 4111023553,  slug: "deepwoken",                   name: "Deepwoken",                     emoji: "🌊", genre: "rpg" },

  // Horror / Survival
  { universe_id: 3647333358, place_id: 9872472334,  slug: "evade",                       name: "Evade",                         emoji: "👻", genre: "horror" },
  { universe_id: 5569032992, place_id: 16116270224, slug: "dandys-world",                name: "Dandy's World",                 emoji: "🎪", genre: "horror" },
  { universe_id: 1000233041, place_id: 2768379856,  slug: "3008",                        name: "3008",                          emoji: "🏬", genre: "horror" },
  { universe_id: 372226183,  place_id: 893973440,   slug: "flee-the-facility",           name: "Flee the Facility",             emoji: "🏃", genre: "horror" },
  { universe_id: 6331902150, place_id: 18687417158, slug: "forsaken",                    name: "Forsaken",                      emoji: "💀", genre: "horror" },
  { universe_id: 1516533665, place_id: 4623386862,  slug: "piggy",                       name: "Piggy",                         emoji: "🐷", genre: "horror" },
  { universe_id: 1489026993, place_id: 4580204640,  slug: "survive-the-killer",          name: "Survive the Killer",            emoji: "🔪", genre: "horror" },
  { universe_id: 803871463,  place_id: 2306562216,  slug: "camping",                     name: "Camping",                       emoji: "⛺", genre: "horror" },
  { universe_id: 1964570867, place_id: 5611648039,  slug: "murder-party",                name: "Murder Party",                  emoji: "🎭", genre: "mystery" },
  { universe_id: 7326934954, place_id: 79546208627805, slug: "99-nights-in-the-forest",  name: "99 Nights in the Forest",       emoji: "🌲", genre: "survival" },

  // Simulator
  { universe_id: 5361032378, place_id: 15532962292, slug: "sols-rng",                    name: "Sol's RNG",                     emoji: "🎲", genre: "simulator" },
  { universe_id: 2316994223, place_id: 6284583030,  slug: "pet-simulator-x",             name: "Pet Simulator X",               emoji: "🐾", genre: "simulator" },
  { universe_id: 3317771874, place_id: 8737899170,  slug: "pet-simulator-99",            name: "Pet Simulator 99",              emoji: "🐶", genre: "simulator" },
  { universe_id: 1235188606, place_id: 3475397644,  slug: "dragon-adventures",           name: "Dragon Adventures",             emoji: "🐉", genre: "simulator" },
  { universe_id: 969012033,  place_id: 2685347741,  slug: "ghost-simulator",             name: "Ghost Simulator",               emoji: "👻", genre: "simulator" },
  { universe_id: 1268927906, place_id: 3623096087,  slug: "muscle-legends",              name: "Muscle Legends",                emoji: "💪", genre: "simulator" },
  { universe_id: 2564505263, place_id: 6766156863,  slug: "strongman-simulator",         name: "Strongman Simulator",           emoji: "🏋️", genre: "simulator" },
  { universe_id: 1335695570, place_id: 3956818381,  slug: "ninja-legends",               name: "Ninja Legends",                 emoji: "🥷", genre: "simulator" },
  { universe_id: 3412390892, place_id: 9072679513,  slug: "anime-impact-simulator",      name: "Anime Impact Simulator",        emoji: "⭐", genre: "simulator" },
  { universe_id: 2655311011, place_id: 6938803436,  slug: "anime-dimensions-simulator",  name: "Anime Dimensions Simulator",    emoji: "✨", genre: "simulator" },
  { universe_id: 6701277882, place_id: 121864768012064, slug: "fish-it",                 name: "Fish It!",                      emoji: "🎣", genre: "simulator" },
  { universe_id: 504035427,  place_id: 1240123653,  slug: "zombie-attack",               name: "Zombie Attack",                 emoji: "🧟", genre: "simulator" },
  { universe_id: 2183179955, place_id: 6035061795,  slug: "my-supermarket",              name: "My Supermarket",                emoji: "🛒", genre: "simulator" },
  { universe_id: 9250782265, place_id: 120575147399256, slug: "clicker-simulator-x",     name: "Clicker Simulator X",           emoji: "👆", genre: "simulator" },
  { universe_id: 4582358979, place_id: 13127800756, slug: "arm-wrestle-simulator",       name: "Arm Wrestle Simulator",         emoji: "💪", genre: "simulator" },
  { universe_id: 7585079192, place_id: 116766451305209, slug: "anime-story",             name: "Anime Story",                   emoji: "📖", genre: "simulator" },

  // Roleplay / Social
  { universe_id: 88070565,   place_id: 185655149,   slug: "welcome-to-bloxburg",         name: "Welcome to Bloxburg",           emoji: "🏡", genre: "roleplay" },
  { universe_id: 140239261,  place_id: 370731277,   slug: "meep-city",                   name: "MeepCity",                      emoji: "🌆", genre: "roleplay" },
  { universe_id: 1008451066, place_id: 2788229376,  slug: "da-hood",                     name: "Da Hood",                       emoji: "🏙️", genre: "roleplay" },
  { universe_id: 1769712451, place_id: 5104202731,  slug: "southwest-florida",           name: "Southwest Florida",             emoji: "🌴", genre: "roleplay" },
  { universe_id: 73885730,   place_id: 155615604,   slug: "prison-life",                 name: "Prison Life",                   emoji: "🔒", genre: "roleplay" },
  { universe_id: 1831550657, place_id: 5233782396,  slug: "creatures-of-sonaria",        name: "Creatures of Sonaria",          emoji: "🦕", genre: "roleplay" },
  { universe_id: 3317679266, place_id: 8737602449,  slug: "pls-donate",                  name: "PLS DONATE",                    emoji: "💸", genre: "roleplay" },
  { universe_id: 1434220026, place_id: 4490140733,  slug: "my-restaurant",               name: "My Restaurant",                 emoji: "🍽️", genre: "roleplay" },
  { universe_id: 3367801828, place_id: 8916037983,  slug: "starving-artists",            name: "Starving Artists",              emoji: "🎨", genre: "roleplay" },
  { universe_id: 2934375089, place_id: 7549229959,  slug: "squid-game",                  name: "Squid Game",                    emoji: "🦑", genre: "roleplay" },

  // Obby
  { universe_id: 83858907,   place_id: 183364845,   slug: "speed-run-4",                 name: "Speed Run 4",                   emoji: "🏃", genre: "obby" },
  { universe_id: 4908792642, place_id: 14184086618, slug: "obby-but-youre-on-a-bike",    name: "Obby But You're on a Bike",     emoji: "🚲", genre: "obby" },
  { universe_id: 3310460039, place_id: 8712817601,  slug: "barrys-prison-run",           name: "BARRY'S PRISON RUN!",           emoji: "🏃", genre: "obby" },

  // Tower Defense / Strategy
  { universe_id: 1176784616, place_id: 3260590327,  slug: "tower-defense-simulator",     name: "Tower Defense Simulator",       emoji: "🗼", genre: "tower-defense" },
  { universe_id: 5578556129, place_id: 16146832113, slug: "anime-vanguards",             name: "Anime Vanguards",               emoji: "🛡️", genre: "tower-defense" },
  { universe_id: 4778845442, place_id: 13775256536, slug: "toilet-tower-defense",        name: "Toilet Tower Defense",          emoji: "🚽", genre: "tower-defense" },
  { universe_id: 1720936166, place_id: 4996049426,  slug: "all-star-tower-defense",      name: "All Star Tower Defense",        emoji: "⭐", genre: "tower-defense" },

  // Sports / Racing
  { universe_id: 6325068386, place_id: 18668065416, slug: "blue-lock-rivals",            name: "Blue Lock: Rivals",             emoji: "⚽", genre: "sports" },
  { universe_id: 1202096104, place_id: 3351674303,  slug: "driving-empire",              name: "Driving Empire",                emoji: "🚗", genre: "sports" },
  { universe_id: 1204566291, place_id: 3360853050,  slug: "super-striker-league",        name: "Super Striker League",          emoji: "⚽", genre: "sports" },
  { universe_id: 5995470825, place_id: 17516596118, slug: "hypershot",                   name: "Hypershot",                     emoji: "🎯", genre: "shooter" },

  // Adventure / Tycoon
  { universe_id: 210851291,  place_id: 537413528,   slug: "build-a-boat-for-treasure",   name: "Build A Boat For Treasure",     emoji: "⛵", genre: "simulator" },
  { universe_id: 47545,      place_id: 192800,       slug: "work-at-a-pizza-place",       name: "Work at a Pizza Place",         emoji: "🍕", genre: "roleplay" },
  { universe_id: 2471084,    place_id: 13822889,    slug: "lumber-tycoon-2",              name: "Lumber Tycoon 2",               emoji: "🪵", genre: "simulator" },
  { universe_id: 1659645941, place_id: 4872321990,  slug: "islands",                     name: "Islands",                       emoji: "🏝️", genre: "simulator" },
  { universe_id: 1318971886, place_id: 3851622790,  slug: "break-in",                    name: "Break In",                      emoji: "🚨", genre: "horror" },
  { universe_id: 1424449565, place_id: 4468711919,  slug: "super-golf",                  name: "Super Golf",                    emoji: "⛳", genre: "sports" },
  { universe_id: 1359546589, place_id: 4110892437,  slug: "kaiju-universe",              name: "Kaiju Universe",                emoji: "🦖", genre: "simulator" },
  { universe_id: 605887098,  place_id: 1554960397,  slug: "car-dealership-tycoon",       name: "Car Dealership Tycoon",         emoji: "🚘", genre: "simulator" },
  { universe_id: 1691616425, place_id: 4934471106,  slug: "heroes-world",                name: "Heroes World",                  emoji: "🦸", genre: "rpg" },
  { universe_id: 2380077519, place_id: 6403373529,  slug: "slap-battles",                name: "Slap Battles",                  emoji: "👋", genre: "rpg" },
  { universe_id: 2619496,    place_id: 6872265039,  slug: "bedwars",                     name: "BedWars",                       emoji: "🛏️", genre: "rpg" },
  { universe_id: 580765040,  place_id: 1466995005,  slug: "ragdoll-universe",             name: "Ragdoll Universe",              emoji: "🪆", genre: "rpg" },
  { universe_id: 1359362132, place_id: 4109933355,  slug: "house-tycoon",                name: "House Tycoon",                  emoji: "🏠", genre: "roleplay" },
];

async function seedGames() {
  console.log(`Seeding ${NEW_GAMES.length} new games...`);
  let success = 0;
  let failed = 0;

  for (const game of NEW_GAMES) {
    const { error } = await supabase
      .from("roblox_games")
      .upsert({
        universe_id: game.universe_id,
        place_id: game.place_id,
        slug: game.slug,
        name: game.name,
        emoji: game.emoji,
        genre: game.genre,
        is_tracked: true,
      }, { onConflict: "universe_id" });

    if (error) {
      console.error(`❌ ${game.name}: ${error.message}`);
      failed++;
    } else {
      console.log(`✅ ${game.name}`);
      success++;
    }
  }

  console.log(`\nDone: ${success} success, ${failed} failed`);
}

seedGames();
