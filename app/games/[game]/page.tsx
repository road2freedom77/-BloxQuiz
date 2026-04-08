import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { supabaseAdmin } from "../../lib/supabase";
import GamesClient from "./GamesClient";
import RobuxCTA from "../../components/RobuxCTA";

const COMMAND_CENTER_SLUGS = [
  "blox-fruits", "brookhaven-rp", "murder-mystery-2", "adopt-me", "grow-a-garden", "dress-to-impress",
  "jujutsu-shenanigans", "dandys-world", "forsaken", "the-strongest-battlegrounds", "fish-it", "99-nights-in-the-forest", "rivals",
];

const gameEmojis: Record<string, string> = {
  "Blox Fruits": "⚔️",
  "Brookhaven RP": "🏠",
  "Adopt Me!": "🐾",
  "Tower of Hell": "🗼",
  "Murder Mystery 2": "🔫",
  "Grow a Garden": "🌱",
  "Royale High": "👑",
  "Doors": "🚪",
  "Arsenal": "🎯",
  "Anime Fighting Simulator": "🥊",
  "Berry Avenue": "🍓",
  "Livetopia": "🏖️",
  "Natural Disaster Survival": "🌪️",
  "Anime Defenders": "🐉",
  "Funky Friday": "🎵",
  "Kick Off": "⚽",
  "Bee Swarm Simulator": "🐝",
  "Dress to Impress": "👗",
  "Fisch": "🎣",
};

const gameData: Record<string, {
  intro: string,
  whatIs: string,
  whatTests: string,
  topics: string[],
  whyPlay: string,
  faqs: { q: string, a: string }[],
}> = {
  "Blox Fruits": {
    intro: "Blox Fruits is one of the most popular adventure games on Roblox, inspired by the world of One Piece. Players explore islands, battle powerful bosses, and unlock unique fruit abilities that grant special combat powers. Mastering the game requires knowledge of fruits, fighting styles, raids, and NPC mechanics. This page collects all Blox Fruits quizzes on BloxQuiz. Whether you're a beginner learning fruit abilities or a veteran testing raid mechanics and awakenings, these quizzes challenge your knowledge of the Blox Fruits universe.",
    whatIs: "Blox Fruits is an open-world Roblox adventure game where players train their character, defeat enemies, and discover powerful Devil Fruits that grant unique abilities. Players choose between mastering sword combat or fruit-based powers as they progress through three seas filled with islands, bosses, and quests. With billions of visits and regular updates adding new fruits, fighting styles, and mechanics, Blox Fruits is one of the most content-rich games on the Roblox platform.",
    whatTests: "Blox Fruits quizzes test a player's understanding of fruit abilities, combat strategies, raid awakenings, and NPC locations. Some quizzes focus on beginner-level gameplay while others challenge experienced players with advanced mechanics and hidden details from across all three seas.",
    topics: ["Fruit abilities and awakenings", "Boss fights and NPC locations", "Sea progression and islands", "Combat mechanics and builds", "Rare fruit knowledge", "Trading values", "Fighting styles"],
    whyPlay: "Playing Blox Fruits quizzes is a fun way to test how well you understand the game's deep mechanics and hidden details. Experienced players can challenge themselves with advanced trivia about fruit awakenings, raid strategies, and boss encounters. New players can discover important game knowledge while exploring different quiz topics.",
    faqs: [
      { q: "How difficult are Blox Fruits quizzes?", a: "Quizzes range from Easy beginner levels covering basic fruit knowledge to Hard expert challenges testing awakening requirements and trading values." },
      { q: "How many Blox Fruits quizzes are available?", a: "The collection grows regularly as new quizzes are added covering fruits, mechanics, lore, and updates." },
      { q: "What topics do Blox Fruits quizzes cover?", a: "Topics include Devil Fruits, fighting styles, boss locations, sea progression, awakening mechanics, and trading knowledge." },
    ],
  },
  "Brookhaven RP": {
    intro: "Brookhaven RP is one of Roblox's most beloved roleplay experiences, attracting millions of players who love its open-world suburban setting. From hidden underground bunkers to secret vehicles and interactive locations, Brookhaven is packed with details most players never discover. Our quizzes cover the full Brookhaven experience — from basic locations and mechanics to advanced secrets and roleplay scenarios.",
    whatIs: "Brookhaven RP is an open-world roleplay game on Roblox where players can live out virtual suburban life. Players can own homes, drive vehicles, explore the town, and interact with other players in creative roleplay scenarios. With its regularly updated world and massive playerbase, Brookhaven RP remains one of the most visited games on the Roblox platform.",
    whatTests: "Brookhaven RP quizzes test knowledge of the game's locations, vehicles, hidden secrets, and interactive mechanics. From identifying buildings and understanding game features to uncovering Easter eggs and secret areas, these quizzes challenge players of all experience levels.",
    topics: ["Town locations and buildings", "Vehicles and transportation", "Hidden secrets and Easter eggs", "Roleplay mechanics", "Interactive features", "Game updates and additions"],
    whyPlay: "Brookhaven RP quizzes are a great way to discover parts of the game you may have never explored. Many players are surprised by how many hidden features and secrets exist in Brookhaven that they've never encountered despite hours of playtime.",
    faqs: [
      { q: "What do Brookhaven RP quizzes cover?", a: "Quizzes cover locations, vehicles, hidden secrets, roleplay mechanics, and interactive features throughout the Brookhaven world." },
      { q: "Are Brookhaven quizzes suitable for new players?", a: "Yes — we have Easy quizzes for newcomers and harder challenges for experienced Brookhaven players who know every corner of the map." },
      { q: "How often are new Brookhaven quizzes added?", a: "New quizzes are added regularly, especially after major Brookhaven updates introduce new locations and features." },
    ],
  },
  "Adopt Me!": {
    intro: "Adopt Me! revolutionized Roblox with its pet trading economy, creating one of the most complex virtual marketplaces in gaming history. With hundreds of pets across dozens of eggs, legendary rarities, neon transformations, and a constantly evolving trading scene, there's an enormous amount of knowledge to master. Our quizzes test everything from basic pet mechanics to advanced trading values and legendary pet histories.",
    whatIs: "Adopt Me! is a Roblox game where players adopt and raise virtual pets, trade with other players, and build their dream home. The game features a complex economy built around pet rarity, with common, uncommon, rare, ultra-rare, and legendary pets available through eggs and limited-time events. Neon and Mega Neon transformations add another layer of depth to the trading and collecting experience.",
    whatTests: "Adopt Me! quizzes test knowledge of pet rarities, egg types, trading values, limited-time events, and game mechanics. From identifying pets by appearance to understanding trading strategies and legendary pet histories, these quizzes challenge both casual players and dedicated traders.",
    topics: ["Pet rarities and types", "Egg mechanics and costs", "Trading values and strategies", "Limited-time events", "Neon and Mega Neon pets", "Home and furniture features", "Game currency and economy"],
    whyPlay: "Adopt Me! quizzes help players become better traders by testing knowledge of pet values and rarity. Understanding the game's economy deeply can make the difference between a great trade and a bad one.",
    faqs: [
      { q: "What do Adopt Me quizzes test?", a: "Quizzes cover pet rarities, egg mechanics, trading values, limited-time event pets, and Neon transformation knowledge." },
      { q: "Are there quizzes about Adopt Me trading?", a: "Yes — we have dedicated Trading angle quizzes that test knowledge of pet values and trading strategies." },
      { q: "How often are new Adopt Me quizzes added?", a: "New quizzes are added regularly, especially after seasonal events introduce new pets and items." },
    ],
  },
  "Tower of Hell": {
    intro: "Tower of Hell is the ultimate test of Roblox parkour skill, challenging players to climb procedurally generated towers of obstacles without checkpoints. With its brutal difficulty, unique section modifiers, and competitive multiplayer format, it has built one of Roblox's most dedicated fanbases. Our quizzes cover everything from basic obstacle types to advanced modifier knowledge and tower strategies.",
    whatIs: "Tower of Hell is a Roblox obby game where players race to climb a randomly generated tower of obstacle sections before the timer runs out. Unlike traditional obbies, there are no checkpoints — fall and you start from the bottom. The game features special modifiers that change gameplay conditions, and a competitive format where the first player to reach the top wins.",
    whatTests: "Tower of Hell quizzes test knowledge of obstacle types, section mechanics, modifiers, tower strategies, and game records. From identifying section names to understanding how modifiers affect gameplay, these quizzes challenge both casual climbers and dedicated speedrunners.",
    topics: ["Obstacle section types", "Game modifiers", "Tower mechanics and rules", "Speedrunning strategies", "Game records and history", "Competitive format knowledge"],
    whyPlay: "Tower of Hell quizzes are a fun way to test your knowledge of the game's mechanics and history. Understanding obstacle patterns and modifier effects can help you become a better climber and reach the top more consistently.",
    faqs: [
      { q: "What do Tower of Hell quizzes cover?", a: "Quizzes cover obstacle types, modifiers, tower mechanics, speedrunning strategies, and competitive gameplay knowledge." },
      { q: "Are Tower of Hell quizzes difficult?", a: "Like the game itself, our harder quizzes are quite challenging. But we also have beginner-friendly quizzes for newer players." },
      { q: "How many Tower of Hell quizzes are available?", a: "The collection grows regularly with new quizzes covering different aspects of Tower of Hell gameplay." },
    ],
  },
  "Murder Mystery 2": {
    intro: "Murder Mystery 2 is a Roblox classic that has stood the test of time with its tense gameplay, deep weapon collection system, and active trading community. With hundreds of knives, guns, and godly weapons plus a complex trading economy and seasonal events, MM2 rewards dedicated players with deep knowledge. Our quizzes cover all aspects from basic gameplay roles to advanced weapon values and trading strategies.",
    whatIs: "Murder Mystery 2 is a Roblox game where players are assigned roles as Innocent, Sheriff, or Murderer each round. The Murderer must eliminate players while avoiding detection, the Sheriff must identify and stop the Murderer, and Innocents must survive. Beyond the core gameplay, MM2 features an extensive weapon collection system with knives and guns of varying rarities, a trading economy, and seasonal events.",
    whatTests: "MM2 quizzes test knowledge of gameplay roles, map layouts, weapon rarities, godly item histories, trading values, and seasonal event content. From basic role mechanics to advanced weapon identification and trading knowledge, these quizzes challenge players across all experience levels.",
    topics: ["Gameplay roles and mechanics", "Knife and gun rarities", "Godly weapon knowledge", "Trading values and strategies", "Map locations and features", "Seasonal events and limited items"],
    whyPlay: "MM2 quizzes help players become better at the game by testing strategic knowledge and weapon identification skills. Understanding weapon values also makes you a smarter trader in the MM2 economy.",
    faqs: [
      { q: "What do Murder Mystery 2 quizzes cover?", a: "Quizzes cover gameplay roles, weapon rarities, godly items, trading values, maps, and seasonal event knowledge." },
      { q: "Are there MM2 trading quizzes?", a: "Yes — dedicated trading quizzes test knowledge of knife and gun values to help you trade smarter." },
      { q: "How often are new MM2 quizzes added?", a: "New quizzes are added regularly, especially after seasonal events introduce new weapons and content." },
    ],
  },
  "Grow a Garden": {
    intro: "Grow a Garden is one of Roblox's fastest-growing simulation games, combining relaxing farming gameplay with surprisingly deep mechanics around rare mutations, crop values, and seasonal events. Players spend hours optimizing their gardens, hunting for rare seeds, and mastering the game's hidden systems. Our quizzes cover everything from basic planting mechanics to advanced mutation triggers and rare crop identification.",
    whatIs: "Grow a Garden is a Roblox farming simulation where players plant seeds, grow crops, and harvest them for in-game currency. The game features a complex mutation system where crops can develop rare variations that significantly increase their value. Seasonal events introduce limited-time seeds and crops, creating a dynamic economy around rare plant knowledge.",
    whatTests: "Grow a Garden quizzes test knowledge of crop types, mutation mechanics, seed rarities, tool usage, and seasonal event content. From identifying basic plants to understanding advanced mutation triggers and optimal harvesting strategies, these quizzes challenge gardeners of all levels.",
    topics: ["Crop types and values", "Mutation mechanics and triggers", "Seed rarities", "Tool usage and optimization", "Seasonal event crops", "Garden layout strategies"],
    whyPlay: "Grow a Garden quizzes help players discover hidden game mechanics and rare crop knowledge that can significantly boost their in-game earnings. Many mutation triggers and rare seed locations are not obvious — our quizzes reveal them through trivia.",
    faqs: [
      { q: "What do Grow a Garden quizzes cover?", a: "Quizzes cover crop types, mutation mechanics, seed rarities, tool optimization, and seasonal event content." },
      { q: "Are there quizzes about rare mutations?", a: "Yes — we have dedicated quizzes testing knowledge of mutation triggers and rare crop identification." },
      { q: "How often are new Grow a Garden quizzes added?", a: "New quizzes are added regularly, especially after seasonal updates introduce new crops and mechanics." },
    ],
  },
  "Royale High": {
    intro: "Royale High is Roblox's premier fantasy roleplay and dress-up experience, beloved for its stunning realms, seasonal halos, and deep trading economy. With hundreds of collectible accessories, diamond-earning strategies, and limited-time event rewards, Royale High has one of the most passionate communities on Roblox. Our quizzes test your knowledge of realms, halos, trading values, and hidden secrets.",
    whatIs: "Royale High is a Roblox fantasy roleplay game where players attend a magical school, explore enchanted realms, and collect rare accessories and halos. The game features a complex trading economy centered around seasonal halos and limited-time event items. Players earn diamonds through activities and use them to purchase cosmetics, decorate their dorm, and participate in the game's social scene.",
    whatTests: "Royale High quizzes test knowledge of realms, halos, seasonal events, trading values, diamond-earning strategies, and game lore. From identifying accessories to understanding halo rarity and trading mechanics, these quizzes challenge players across all experience levels.",
    topics: ["Realms and locations", "Seasonal halos and values", "Accessories and cosmetics", "Diamond earning strategies", "Trading mechanics", "Seasonal events and limited items", "Game lore and characters"],
    whyPlay: "Royale High quizzes help players discover hidden realms, understand halo values, and become better traders. The game's economy is complex — our quizzes help you navigate it with confidence.",
    faqs: [
      { q: "What do Royale High quizzes cover?", a: "Quizzes cover realms, halos, accessories, trading values, diamond strategies, and seasonal event knowledge." },
      { q: "Are there Royale High trading quizzes?", a: "Yes — dedicated trading quizzes test knowledge of halo values and seasonal item worth." },
      { q: "How often are new Royale High quizzes added?", a: "New quizzes are added regularly, especially after seasonal events introduce new halos and content." },
    ],
  },
  "Doors": {
    intro: "Doors is one of Roblox's most thrilling horror experiences, sending players through procedurally generated hotel floors filled with terrifying entities, hidden items, and deadly traps. With a deep lore system, multiple floors, and a dedicated community of speedrunners and secret hunters, Doors rewards players who study its mechanics carefully. Our quizzes cover all entities, item uses, floor strategies, and hidden secrets.",
    whatIs: "Doors is a Roblox horror game where players navigate through numbered rooms in a procedurally generated hotel, avoiding dangerous entities and solving environmental puzzles. Each entity has unique behavior patterns that players must learn to survive. The game features a rich lore system, hidden secrets, and multiple floors including The Hotel and The Mines, each with their own unique challenges and entities.",
    whatTests: "Doors quizzes test knowledge of entity behaviors, item functions, room mechanics, survival strategies, and hidden lore. From identifying entities by their attack patterns to understanding how to use items effectively, these quizzes challenge both casual players and dedicated Doors veterans.",
    topics: ["Entity names and behaviors", "Item uses and locations", "Room mechanics and traps", "Survival strategies", "Hidden secrets and lore", "Floor-specific knowledge", "Speedrunning techniques"],
    whyPlay: "Doors quizzes help players survive longer by testing knowledge of entity patterns and item usage. Understanding how each entity behaves can mean the difference between reaching Door 100 and getting eliminated early.",
    faqs: [
      { q: "What do Doors quizzes cover?", a: "Quizzes cover entity behaviors, item functions, room mechanics, survival strategies, hidden lore, and floor-specific knowledge." },
      { q: "Are Doors quizzes scary?", a: "The quizzes themselves aren't scary — but testing your entity knowledge might reveal how much you don't know about surviving the hotel!" },
      { q: "How often are new Doors quizzes added?", a: "New quizzes are added regularly, especially after updates introduce new entities, floors, and mechanics." },
    ],
  },
  "Arsenal": {
    intro: "Arsenal is Roblox's most popular first-person shooter, combining fast-paced gunplay with a massive weapon progression system. With dozens of maps, killstreak rewards, and seasonal content, Arsenal has built a competitive community that demands sharp reflexes and deep game knowledge. Our quizzes cover weapons, maps, game modes, and advanced combat mechanics.",
    whatIs: "Arsenal is a Roblox FPS game where players progress through a series of weapons by getting kills, working their way from basic guns down to a golden knife to win the round. The game features multiple maps, game modes, seasonal skins, and a competitive ranking system. With its fast-paced gameplay and large weapon roster, Arsenal rewards players who know its mechanics deeply.",
    whatTests: "Arsenal quizzes test knowledge of weapons, maps, game modes, killstreak mechanics, seasonal content, and competitive strategies. From identifying guns by their stats to understanding map layouts and competitive tactics, these quizzes challenge players of all skill levels.",
    topics: ["Weapon types and stats", "Map layouts and callouts", "Game modes and rules", "Killstreak mechanics", "Seasonal skins and events", "Competitive strategies", "Game history and records"],
    whyPlay: "Arsenal quizzes help players improve their game knowledge and competitive edge. Understanding weapon progression, map layouts, and game mechanics can significantly improve your performance in matches.",
    faqs: [
      { q: "What do Arsenal quizzes cover?", a: "Quizzes cover weapons, maps, game modes, killstreak mechanics, seasonal content, and competitive strategies." },
      { q: "Are Arsenal quizzes good for improving gameplay?", a: "Yes — understanding weapon stats, map layouts, and game mechanics tested in our quizzes can help improve your match performance." },
      { q: "How often are new Arsenal quizzes added?", a: "New quizzes are added regularly, especially after seasonal updates introduce new weapons and content." },
    ],
  },
  "Anime Fighting Simulator": {
    intro: "Anime Fighting Simulator brings the world of anime to Roblox with an enormous roster of transformations, stands, quirks, and training zones inspired by the biggest anime series. With constant updates adding new abilities and benchmarks, there's always more to master. Our quizzes cover everything from basic training mechanics to advanced stand abilities and transformation requirements.",
    whatIs: "Anime Fighting Simulator is a Roblox game inspired by popular anime series where players train their character's stats, unlock powerful transformations, and battle other players. The game features abilities from anime like Dragon Ball, Naruto, One Piece, and more. Players grind training zones to increase their power level and unlock increasingly powerful abilities through benchmark milestones.",
    whatTests: "AFS quizzes test knowledge of transformations, stand abilities, training mechanics, benchmark requirements, and anime-inspired content. From identifying abilities by their anime origin to understanding optimal training strategies, these quizzes challenge both casual fans and dedicated grinders.",
    topics: ["Transformation types and requirements", "Stand and quirk abilities", "Training zones and mechanics", "Benchmark milestones", "Anime origins of abilities", "Power scaling and stats"],
    whyPlay: "AFS quizzes help players discover new transformations and understand the game's complex progression system. Many benchmark requirements and ability details are not obvious — our quizzes reveal them through trivia.",
    faqs: [
      { q: "What do Anime Fighting Simulator quizzes cover?", a: "Quizzes cover transformations, stand abilities, training mechanics, benchmark requirements, and anime-inspired content." },
      { q: "Do I need to know anime to play these quizzes?", a: "Not necessarily — many questions focus on in-game mechanics rather than anime lore, though anime knowledge definitely helps!" },
      { q: "How often are new AFS quizzes added?", a: "New quizzes are added regularly, especially after major updates introduce new abilities and content." },
    ],
  },
  "Berry Avenue": {
    intro: "Berry Avenue is one of Roblox's most popular roleplay games, offering a rich suburban world filled with jobs, vehicles, interactive locations, and social scenarios. Its detailed world and regular updates keep millions of players coming back. Our quizzes test your knowledge of Berry Avenue's locations, activities, vehicles, and hidden features.",
    whatIs: "Berry Avenue is a Roblox roleplay game set in a detailed suburban environment where players can work jobs, drive vehicles, explore shops and buildings, and engage in creative social roleplay. The game is known for its realistic atmosphere, interactive locations, and regular content updates that add new areas and features to explore.",
    whatTests: "Berry Avenue quizzes test knowledge of locations, jobs, vehicles, interactive features, and hidden secrets throughout the game world. From identifying buildings to understanding job mechanics and discovering hidden areas, these quizzes challenge players of all experience levels.",
    topics: ["Town locations and buildings", "Jobs and activities", "Vehicles and transportation", "Hidden secrets and Easter eggs", "Interactive features", "Game updates and new content"],
    whyPlay: "Berry Avenue quizzes help players discover parts of the game they may have missed and deepen their appreciation for the game's detailed world. Many hidden features and secrets reward players who know where to look.",
    faqs: [
      { q: "What do Berry Avenue quizzes cover?", a: "Quizzes cover locations, jobs, vehicles, interactive features, and hidden secrets throughout Berry Avenue." },
      { q: "Are Berry Avenue quizzes good for new players?", a: "Yes — our beginner quizzes help new players learn the game's layout and features quickly." },
      { q: "How often are new Berry Avenue quizzes added?", a: "New quizzes are added regularly after updates introduce new locations and features." },
    ],
  },
  "Livetopia": {
    intro: "Livetopia is a vibrant Roblox roleplay experience packed with activities, jobs, vehicles, and social spaces that keep players engaged for hours. With its colorful world and regular content updates, it has grown into one of the platform's most visited games. Our quizzes cover Livetopia's locations, mechanics, vehicles, and secrets.",
    whatIs: "Livetopia is a Roblox roleplay game featuring a bright, colorful world where players can work various jobs, explore different districts, drive vehicles, and socialize with other players. The game is known for its vibrant aesthetic, diverse activities, and frequent updates that keep the experience fresh and engaging for its large community.",
    whatTests: "Livetopia quizzes test knowledge of districts, jobs, vehicles, activities, and hidden features throughout the game world. From identifying locations to understanding job mechanics and discovering Easter eggs, these quizzes challenge Livetopia players of all levels.",
    topics: ["Districts and locations", "Jobs and activities", "Vehicles and transportation", "Hidden secrets", "Interactive features", "Game updates and new content"],
    whyPlay: "Livetopia quizzes are a fun way to test how well you really know the game's world and discover features you may have overlooked during normal gameplay.",
    faqs: [
      { q: "What do Livetopia quizzes cover?", a: "Quizzes cover districts, jobs, vehicles, activities, and hidden features throughout the Livetopia world." },
      { q: "Are Livetopia quizzes suitable for all ages?", a: "Yes — all our quizzes are family-friendly and suitable for Livetopia's diverse playerbase." },
      { q: "How often are new Livetopia quizzes added?", a: "New quizzes are added regularly after updates introduce new content." },
    ],
  },
  "Natural Disaster Survival": {
    intro: "Natural Disaster Survival is a Roblox classic that has tested players' quick thinking and survival instincts for years. With a variety of disasters from earthquakes to alien invasions, each round demands different strategies and map knowledge. Our quizzes cover all disaster types, survival strategies, map features, and game mechanics.",
    whatIs: "Natural Disaster Survival is a Roblox game where players must survive a randomly selected natural disaster on one of several maps. Disasters include floods, earthquakes, tornados, fires, acid rain, and more unusual events like alien invasions. Players must use their knowledge of each disaster's behavior and map layout to find safe spots and outlast other players.",
    whatTests: "NDS quizzes test knowledge of disaster types, survival strategies, map layouts, safe spots, and game mechanics. From identifying disaster behaviors to knowing the best hiding spots on each map, these quizzes challenge both casual survivors and dedicated NDS veterans.",
    topics: ["Disaster types and behaviors", "Survival strategies per disaster", "Map layouts and safe spots", "Game mechanics and rules", "Rare disasters and events", "Scoring and progression"],
    whyPlay: "NDS quizzes help players improve their survival rate by testing knowledge of disaster patterns and map-specific strategies. Knowing where to hide during each disaster type is crucial knowledge that our quizzes help reinforce.",
    faqs: [
      { q: "What do Natural Disaster Survival quizzes cover?", a: "Quizzes cover disaster types, survival strategies, map layouts, safe spots, and game mechanics." },
      { q: "How many disasters are in Natural Disaster Survival?", a: "Our quizzes cover all the major disaster types — take them to find out exactly how many there are!" },
      { q: "How often are new NDS quizzes added?", a: "New quizzes are added regularly to keep the trivia collection fresh and challenging." },
    ],
  },
  "Anime Defenders": {
    intro: "Anime Defenders is one of Roblox's most popular tower defense games, featuring hundreds of units inspired by iconic anime series. With complex evolution chains, trait systems, and stage mechanics, mastering Anime Defenders requires serious dedication. Our quizzes cover unit stats, evolution requirements, summon mechanics, and stage strategies.",
    whatIs: "Anime Defenders is a Roblox tower defense game where players place anime-inspired units on a map to defeat waves of enemies. Units are inspired by characters from Dragon Ball, Naruto, One Piece, Demon Slayer, and many other popular anime series. The game features a gacha summon system, complex unit evolution chains, trait mechanics that boost unit performance, and increasingly challenging stages.",
    whatTests: "Anime Defenders quizzes test knowledge of unit abilities, evolution requirements, summon mechanics, trait combinations, stage strategies, and anime origins. From identifying units by their abilities to understanding optimal team compositions, these quizzes challenge players of all levels.",
    topics: ["Unit types and abilities", "Evolution chains and requirements", "Summon mechanics and rates", "Trait combinations", "Stage strategies", "Anime origins of units", "Team composition optimization"],
    whyPlay: "Anime Defenders quizzes help players understand the game's complex systems and build stronger teams. Knowing unit evolution requirements and trait synergies can dramatically improve your stage clear rates.",
    faqs: [
      { q: "What do Anime Defenders quizzes cover?", a: "Quizzes cover unit abilities, evolution requirements, summon mechanics, trait combinations, and stage strategies." },
      { q: "Do I need anime knowledge to play these quizzes?", a: "Some questions reference anime origins, but most focus on in-game mechanics that any dedicated player would know." },
      { q: "How often are new Anime Defenders quizzes added?", a: "New quizzes are added regularly after updates introduce new units and content." },
    ],
  },
  "Funky Friday": {
    intro: "Funky Friday is Roblox's most popular rhythm game, featuring a massive library of songs, competitive battles, and a deep ranking system. With its active community and regular song additions, there's always new content to master. Our quizzes test your knowledge of songs, mechanics, characters, ranks, and game history.",
    whatIs: "Funky Friday is a Roblox rhythm game inspired by Friday Night Funkin' where players battle opponents by hitting arrow keys in time with music. The game features hundreds of songs across many different mods and characters, a competitive ranking system, and an active community that regularly contributes new content. Players can battle friends or strangers and climb the global leaderboard.",
    whatTests: "Funky Friday quizzes test knowledge of songs, characters, arrow patterns, ranking mechanics, game modes, and the game's history and community. From identifying songs by their characters to understanding ranking thresholds and game mechanics, these quizzes challenge rhythm game enthusiasts.",
    topics: ["Songs and music mods", "Characters and their origins", "Ranking system and thresholds", "Game mechanics and controls", "Game modes and features", "Community history"],
    whyPlay: "Funky Friday quizzes are a fun way to test your rhythm game knowledge and discover songs or characters you may not have tried yet. The game has hundreds of songs — our quizzes help you explore them all.",
    faqs: [
      { q: "What do Funky Friday quizzes cover?", a: "Quizzes cover songs, characters, ranking mechanics, game modes, and the history of Funky Friday's community." },
      { q: "Do I need to be good at rhythm games for these quizzes?", a: "No — the quizzes test game knowledge, not rhythm skills. Anyone can participate!" },
      { q: "How often are new Funky Friday quizzes added?", a: "New quizzes are added regularly as new songs and content are added to the game." },
    ],
  },
  "Kick Off": {
    intro: "Kick Off brings the excitement of football to Roblox with team-based matches, skill moves, power shots, and competitive tournaments. With its growing community and regular updates, it has become one of Roblox's top sports games. Our quizzes cover teams, mechanics, skills, tactics, and tournament knowledge.",
    whatIs: "Kick Off is a Roblox football game where players compete in team-based matches using skill moves, power shots, and tactical positioning to score goals. The game features multiple teams, stadiums, seasonal tournaments, and a progression system that rewards dedicated players. With its realistic football mechanics adapted for Roblox, Kick Off appeals to both football fans and competitive gamers.",
    whatTests: "Kick Off quizzes test knowledge of game mechanics, skill moves, teams, stadiums, tournament rules, and tactical strategies. From understanding power shot mechanics to knowing team strengths and tournament formats, these quizzes challenge Kick Off players of all levels.",
    topics: ["Game mechanics and controls", "Skill moves and techniques", "Teams and their attributes", "Stadiums and maps", "Tournament formats", "Tactical strategies", "Seasonal events and updates"],
    whyPlay: "Kick Off quizzes help players improve their tactical understanding of the game and discover skill moves or strategies they may not have tried. Better game knowledge translates directly to better performance on the pitch.",
    faqs: [
      { q: "What do Kick Off quizzes cover?", a: "Quizzes cover game mechanics, skill moves, teams, stadiums, tournament formats, and tactical strategies." },
      { q: "Do I need to know real football to play Kick Off quizzes?", a: "Not necessarily — our quizzes focus on in-game mechanics and Roblox Kick Off knowledge rather than real-world football." },
      { q: "How often are new Kick Off quizzes added?", a: "New quizzes are added regularly after seasonal updates and tournaments introduce new content." },
    ],
  },
  "Bee Swarm Simulator": {
    intro: "Bee Swarm Simulator is one of Roblox's most beloved progression games, challenging players to grow a thriving hive, collect pollen from fields, and convert it into honey to unlock powerful upgrades. With dozens of bee types, complex field mechanics, quests from unique NPC characters, and a deep crafting system built around amulets and royal jelly, there is an enormous amount of knowledge to master. Our quizzes cover everything from basic hive mechanics to advanced field strategies, NPC quest rewards, and rare item knowledge.",
    whatIs: "Bee Swarm Simulator is a Roblox game where players collect bees, gather pollen from fields, and convert it into honey to purchase upgrades and grow their hive. Each bee has unique abilities that contribute to pollen collection, honey conversion, and combat against monster enemies. The game features a rich quest system with NPC characters, a complex amulet and crafting system, and regular seasonal events that introduce limited-time bees and exclusive items.",
    whatTests: "Bee Swarm Simulator quizzes test knowledge of bee types and abilities, field pollen values, NPC quest requirements, amulet crafting, royal jelly mechanics, and seasonal event content. From identifying bees by their rarity to understanding optimal field rotation strategies and late-game quest progression, these quizzes challenge players at every stage of the game.",
    topics: ["Bee types, rarities, and abilities", "Field types and pollen values", "NPC quests and rewards", "Amulet crafting and bonuses", "Royal jelly and mutation mechanics", "Seasonal events and limited bees", "Honey and ticket economy"],
    whyPlay: "Bee Swarm Simulator quizzes help players discover hidden mechanics and optimize their hive progression. Many amulet bonuses, quest requirements, and field strategies are far from obvious — our quizzes surface them through trivia and challenge you to deepen your mastery of the game's complex systems.",
    faqs: [
      { q: "What do Bee Swarm Simulator quizzes cover?", a: "Quizzes cover bee types, field mechanics, NPC quests, amulet crafting, royal jelly, and seasonal event content." },
      { q: "Are there quizzes for advanced BSS players?", a: "Yes — we have quizzes covering advanced topics like amulet optimization, rare bee abilities, and late-game quest mechanics." },
      { q: "How often are new Bee Swarm Simulator quizzes added?", a: "New quizzes are added regularly, especially after seasonal events introduce new bees and mechanics." },
    ],
  },
  "Dress to Impress": {
    intro: "Dress to Impress is one of Roblox's fastest-growing fashion games, challenging players to style outfits around themed prompts and earn votes from other players. With a vast wardrobe of clothing items, accessories, and shoes, plus rotating themes and seasonal event exclusives, the game rewards both creative flair and deep knowledge of its item catalog. Our quizzes cover outfit strategies, item knowledge, theme interpretation, and all the mechanics behind climbing the leaderboard.",
    whatIs: "Dress to Impress is a Roblox fashion game where players compete by styling their avatar around a randomly selected theme within a time limit. Other players then vote on the best outfits, with the highest-voted looks earning the most points. The game features a constantly expanding wardrobe of items, seasonal event collections, and a social voting format that rewards creativity and sharp fashion knowledge.",
    whatTests: "Dress to Impress quizzes test knowledge of clothing items and accessories, theme interpretation strategies, voting mechanics, seasonal event collections, and styling tips. From identifying items by category to understanding what separates winning outfits from the rest, these quizzes challenge fashion enthusiasts of all experience levels.",
    topics: ["Clothing items and accessories", "Theme interpretation strategies", "Voting mechanics and scoring", "Seasonal event collections", "Styling tips and combinations", "Game mechanics and features", "Popular trends and meta styles"],
    whyPlay: "Dress to Impress quizzes help players build a stronger fashion sense and deeper item knowledge that translates directly into better voting performance. Understanding what makes a winning outfit and knowing the full catalog of available items gives you a genuine competitive edge in every round.",
    faqs: [
      { q: "What do Dress to Impress quizzes cover?", a: "Quizzes cover clothing items, theme strategies, voting mechanics, seasonal collections, and styling knowledge." },
      { q: "Do I need to be good at fashion to play these quizzes?", a: "Not at all — our beginner quizzes cover basic game mechanics, while harder quizzes test advanced styling and item knowledge." },
      { q: "How often are new Dress to Impress quizzes added?", a: "New quizzes are added regularly, especially after seasonal events introduce new clothing collections." },
    ],
  },
  "Fisch": {
    intro: "Fisch is one of Roblox's most relaxing yet surprisingly deep fishing games, challenging players to discover rare fish across multiple locations, master different rod types, and build up their collection. With hidden fish species, seasonal events, and a thriving trading community, there's far more to Fisch than casting a line. Our quizzes cover everything from basic fishing mechanics to rare fish locations and advanced rod knowledge.",
    whatIs: "Fisch is a Roblox fishing game where players cast their line across a variety of locations to catch fish of different rarities. The game features dozens of fish species, multiple rod types with different stats, bait mechanics, and a trading system. Seasonal events introduce limited-time fish and exclusive gear, creating a dynamic economy around rare catches.",
    whatTests: "Fisch quizzes test knowledge of fish species and rarities, rod types and stats, bait mechanics, fishing locations, trading values, and seasonal event content. From identifying fish by their appearance to understanding optimal fishing strategies, these quizzes challenge anglers of all experience levels.",
    topics: ["Fish species and rarities", "Rod types and stats", "Bait mechanics", "Fishing locations", "Trading values", "Seasonal events and limited fish", "Progression and upgrades"],
    whyPlay: "Fisch quizzes help players discover rare fish locations and understand the game's deeper mechanics. Many rare fish spawn conditions and rod stat differences are not obvious — our quizzes surface them through trivia.",
    faqs: [
      { q: "What do Fisch quizzes cover?", a: "Quizzes cover fish species, rod types, bait mechanics, fishing locations, trading values, and seasonal event content." },
      { q: "Are there Fisch quizzes for beginners?", a: "Yes — we have beginner-friendly quizzes covering basic fishing mechanics as well as harder challenges testing rare fish knowledge." },
      { q: "How often are new Fisch quizzes added?", a: "New quizzes are added regularly, especially after updates introduce new fish species and locations." },
    ],
  },
};

const relatedGames: Record<string, string[]> = {
  "Blox Fruits": ["Murder Mystery 2", "Anime Defenders", "Arsenal"],
  "Brookhaven RP": ["Berry Avenue", "Livetopia", "Adopt Me!"],
  "Adopt Me!": ["Royale High", "Brookhaven RP", "Grow a Garden"],
  "Tower of Hell": ["Arsenal", "Funky Friday", "Natural Disaster Survival"],
  "Murder Mystery 2": ["Arsenal", "Blox Fruits", "Doors"],
  "Grow a Garden": ["Adopt Me!", "Livetopia", "Berry Avenue"],
  "Royale High": ["Adopt Me!", "Berry Avenue", "Dress to Impress"],
  "Doors": ["Murder Mystery 2", "Natural Disaster Survival", "Arsenal"],
  "Arsenal": ["Murder Mystery 2", "Tower of Hell", "Kick Off"],
  "Anime Fighting Simulator": ["Anime Defenders", "Blox Fruits", "Arsenal"],
  "Berry Avenue": ["Brookhaven RP", "Livetopia", "Royale High"],
  "Livetopia": ["Berry Avenue", "Brookhaven RP", "Adopt Me!"],
  "Natural Disaster Survival": ["Doors", "Tower of Hell", "Arsenal"],
  "Anime Defenders": ["Anime Fighting Simulator", "Blox Fruits", "Doors"],
  "Funky Friday": ["Tower of Hell", "Arsenal", "Kick Off"],
  "Kick Off": ["Arsenal", "Funky Friday", "Tower of Hell"],
  "Bee Swarm Simulator": ["Grow a Garden", "Adopt Me!", "Natural Disaster Survival"],
  "Dress to Impress": ["Royale High", "Berry Avenue", "Brookhaven RP"],
  "Fisch": ["Bee Swarm Simulator", "Grow a Garden", "Adopt Me!"],
};

const gameSlugMap: Record<string, string> = {
  "Blox Fruits": "blox-fruits",
  "Brookhaven RP": "brookhaven-rp",
  "Adopt Me!": "adopt-me",
  "Tower of Hell": "tower-of-hell",
  "Murder Mystery 2": "murder-mystery-2",
  "Grow a Garden": "grow-a-garden",
  "Royale High": "royale-high",
  "Doors": "doors",
  "Arsenal": "arsenal",
  "Anime Fighting Simulator": "anime-fighting-simulator",
  "Berry Avenue": "berry-avenue",
  "Livetopia": "livetopia",
  "Natural Disaster Survival": "natural-disaster-survival",
  "Anime Defenders": "anime-defenders",
  "Funky Friday": "funky-friday",
  "Kick Off": "kick-off",
  "Bee Swarm Simulator": "bee-swarm-simulator",
  "Dress to Impress": "dress-to-impress",
  "Fisch": "fisch",
  "RIVALS": "rivals",
  "The Strongest Battlegrounds": "the-strongest-battlegrounds",
  "Jujutsu Shenanigans": "jujutsu-shenanigans",
  "Blade Ball": "blade-ball",
  "Attack on Titan Revolution": "attack-on-titan-revolution",
  "Jujutsu Infinite": "jujutsu-infinite",
  "Grand Piece Online": "grand-piece-online",
  "Anime Battlegrounds X": "anime-battlegrounds-x",
  "Fruit Battlegrounds": "fruit-battlegrounds",
  "Project Slayers": "project-slayers",
  "Demon Slayer RPG 2": "demon-slayer-rpg-2",
  "King Legacy": "king-legacy",
  "Untitled Boxing Game": "untitled-boxing-game",
  "Shindo Life": "shindo-life",
  "Ro-Ghoul": "ro-ghoul",
  "Type Soul": "type-soul",
  "Deepwoken": "deepwoken",
  "Evade": "evade",
  "Dandy's World": "dandys-world",
  "3008": "3008",
  "Flee the Facility": "flee-the-facility",
  "Forsaken": "forsaken",
  "Piggy": "piggy",
  "Survive the Killer": "survive-the-killer",
  "Camping": "camping",
  "Murder Party": "murder-party",
  "99 Nights in the Forest": "99-nights-in-the-forest",
  "Sol's RNG": "sols-rng",
  "Pet Simulator X": "pet-simulator-x",
  "Pet Simulator 99": "pet-simulator-99",
  "Dragon Adventures": "dragon-adventures",
  "Ghost Simulator": "ghost-simulator",
  "Muscle Legends": "muscle-legends",
  "Strongman Simulator": "strongman-simulator",
  "Ninja Legends": "ninja-legends",
  "Anime Impact Simulator": "anime-impact-simulator",
  "Anime Dimensions Simulator": "anime-dimensions-simulator",
  "Fish It!": "fish-it",
  "Zombie Attack": "zombie-attack",
  "My Supermarket": "my-supermarket",
  "Clicker Simulator X": "clicker-simulator-x",
  "Arm Wrestle Simulator": "arm-wrestle-simulator",
  "Anime Story": "anime-story",
  "Welcome to Bloxburg": "welcome-to-bloxburg",
  "MeepCity": "meep-city",
  "Da Hood": "da-hood",
  "Southwest Florida": "southwest-florida",
  "Prison Life": "prison-life",
  "Creatures of Sonaria": "creatures-of-sonaria",
  "PLS DONATE": "pls-donate",
  "My Restaurant": "my-restaurant",
  "Starving Artists": "starving-artists",
  "Squid Game": "squid-game",
  "Speed Run 4": "speed-run-4",
  "Obby But You're on a Bike": "obby-but-youre-on-a-bike",
  "BARRY'S PRISON RUN!": "barrys-prison-run",
  "Tower Defense Simulator": "tower-defense-simulator",
  "Anime Vanguards": "anime-vanguards",
  "Toilet Tower Defense": "toilet-tower-defense",
  "All Star Tower Defense": "all-star-tower-defense",
  "Blue Lock: Rivals": "blue-lock-rivals",
  "Driving Empire": "driving-empire",
  "Super Striker League": "super-striker-league",
  "Hypershot": "hypershot",
  "Build A Boat For Treasure": "build-a-boat-for-treasure",
  "Work at a Pizza Place": "work-at-a-pizza-place",
  "Lumber Tycoon 2": "lumber-tycoon-2",
  "Islands": "islands",
  "Break In": "break-in",
  "Super Golf": "super-golf",
  "Kaiju Universe": "kaiju-universe",
  "Car Dealership Tycoon": "car-dealership-tycoon",
  "Heroes World": "heroes-world",
  "Slap Battles": "slap-battles",
  "BedWars": "bedwars",
  "Ragdoll Universe": "ragdoll-universe",
  "House Tycoon": "house-tycoon",
};

function slugToDisplayName(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function inferAngleServer(title: string, slug: string): string | null {
  const text = (title + " " + slug).toLowerCase();
  if (text.includes("beginner") || text.includes("basics") || text.includes("starter") ||
      text.includes("essentials") || text.includes("introduction") || text.includes("intro")) return "Beginner";
  if (text.includes("trading") || text.includes("trade") || text.includes("market") ||
      text.includes("value") || text.includes("economy") || text.includes("price")) return "Trading";
  if (text.includes("mechanic") || text.includes("combat") || text.includes("system") ||
      text.includes("ability") || text.includes("skill") || text.includes("awakening")) return "Mechanics";
  if (text.includes("expert") || text.includes("advanced") || text.includes("mastery") ||
      text.includes("ultimate") || text.includes("master") || text.includes("intermediate") ||
      text.includes("knowledge")) return "Expert";
  if (text.includes("lore") || text.includes("story") || text.includes("history") ||
      text.includes("character") || text.includes("world") || text.includes("legend")) return "Lore";
  if (text.includes("secret") || text.includes("hidden") || text.includes("easter egg") ||
      text.includes("mystery") || text.includes("unknown") || text.includes("discovery")) return "Secrets";
  if (text.includes("update") || text.includes("new content") || text.includes("latest") ||
      text.includes("recent") || text.includes("patch") || text.includes("season")) return "Updates";
  if (text.includes("fish") || text.includes("rod") || text.includes("bait") ||
      text.includes("catch") || text.includes("cast")) return "Fishing";
  return null;
}

function slugToGame(): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [gameName, slug] of Object.entries(gameSlugMap)) {
    const data = gameData[gameName];
    result[slug] = {
      displayName: gameName,
      emoji: gameEmojis[gameName] || "🎮",
      title: gameName + " Quizzes — Test Your Roblox Knowledge | BloxQuiz",
      description: "Think you know " + gameName + "? Take free Roblox trivia quizzes covering mechanics, lore, trading, and secrets. Multiple difficulty levels on BloxQuiz.gg",
      intro: data?.intro || "Test your " + gameName + " knowledge with free trivia quizzes on BloxQuiz.",
      whatIs: data?.whatIs || "",
      whatTests: data?.whatTests || "",
      topics: data?.topics || [],
      whyPlay: data?.whyPlay || "",
      faqs: data?.faqs || [],
      related: relatedGames[gameName] || [],
    };
  }
  return result;
}

function buildFallbackConfig(slug: string) {
  const displayName = slugToDisplayName(slug);
  return {
    displayName,
    emoji: "🎮",
    title: displayName + " Quizzes — Test Your Roblox Knowledge | BloxQuiz",
    description: "Think you know " + displayName + "? Take free Roblox trivia quizzes on BloxQuiz.gg. Multiple difficulty levels available.",
    intro: "Test your " + displayName + " knowledge with free trivia quizzes on BloxQuiz. New quizzes are being added regularly — check back soon!",
    whatIs: "",
    whatTests: "",
    topics: [],
    whyPlay: "",
    faqs: [],
    related: [],
  };
}

async function getQuizzesForGame(displayName: string) {
  try {
    const { data } = await supabase
      .from("quizzes")
      .select("slug, title, game, difficulty, questions, angle")
      .eq("game", displayName)
      .order("published_at", { ascending: false });

    if (data) {
      return data.map(q => ({
        slug: q.slug,
        title: q.title,
        game: q.game,
        difficulty: q.difficulty,
        questions: Array.isArray(q.questions) ? q.questions.length : 10,
        angle: q.angle || inferAngleServer(q.title, q.slug),
      }));
    }
  } catch (e) {}
  return [];
}

async function getGameStats(gameSlug: string): Promise<{ currentPlayers: number | null; totalVisits: number | null; thumbnailUrl: string | null } | null> {
  try {
    const { data } = await supabaseAdmin
      .from("roblox_games")
      .select("current_players, total_visits, thumbnail_url")
      .eq("slug", gameSlug)
      .single();
    if (!data) return null;
    return { currentPlayers: data.current_players, totalVisits: data.total_visits, thumbnailUrl: data.thumbnail_url };
  } catch (e) {
    return null;
  }
}

async function getHistoryInsights(slug: string) {
  try {
    const { data } = await supabaseAdmin
      .from("game_history_insights_14d")
      .select("trend_label, trend_pct_7d, volatility_label, avg_players_7d, weekend_lift_pct")
      .eq("slug", slug)
      .single();
    return data ?? null;
  } catch (e) {
    return null;
  }
}

async function getActiveCodes(slug: string): Promise<number> {
  try {
    const { count } = await supabaseAdmin
      .from("codes")
      .select("*", { count: "exact", head: true })
      .eq("slug", slug)
      .eq("active", true);
    return count ?? 0;
  } catch (e) {
    return 0;
  }
}

async function getGuideForGame(gameSlug: string): Promise<{ slug: string; title: string } | null> {
  try {
    const { data } = await supabaseAdmin
      .from("game_guides")
      .select("slug, title")
      .eq("game_slug", gameSlug)
      .eq("status", "published")
      .limit(1)
      .single();
    return data ?? null;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const config = slugToGame()[game] ?? buildFallbackConfig(game);
  return {
    title: config.title,
    description: config.description,
    alternates: { canonical: "https://www.bloxquiz.gg/games/" + game },
    openGraph: {
      title: config.title,
      description: config.description,
      url: "https://www.bloxquiz.gg/games/" + game,
      siteName: "BloxQuiz",
      type: "website",
    },
  };
}

export default async function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const config = slugToGame()[game] ?? buildFallbackConfig(game);
  const isCommandCenter = COMMAND_CENTER_SLUGS.includes(game);

  const [quizzes, statsData, insights, activeCodes, guide] = await Promise.all([
    getQuizzesForGame(config.displayName),
    getGameStats(game),
    isCommandCenter ? getHistoryInsights(game) : Promise.resolve(null),
    isCommandCenter ? getActiveCodes(game) : Promise.resolve(0),
    getGuideForGame(game),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bloxquiz.gg" },
          { "@type": "ListItem", "position": 2, "name": "Roblox Games", "item": "https://www.bloxquiz.gg/browse" },
          { "@type": "ListItem", "position": 3, "name": config.displayName + " Quizzes", "item": "https://www.bloxquiz.gg/games/" + game },
        ]
      },
      {
        "@type": "CollectionPage",
        "@id": "https://www.bloxquiz.gg/games/" + game,
        "url": "https://www.bloxquiz.gg/games/" + game,
        "name": config.displayName + " Quizzes | BloxQuiz",
        "description": config.description,
        "inLanguage": "en-US",
        "hasPart": quizzes.slice(0, 10).map(q => ({
          "@type": "Quiz",
          "name": q.title,
          "url": "https://www.bloxquiz.gg/quiz/" + q.slug,
        })),
      },
      {
        "@type": "ItemList",
        "name": config.displayName + " Quizzes",
        "itemListElement": quizzes.slice(0, 10).map((q, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": q.title,
          "url": "https://www.bloxquiz.gg/quiz/" + q.slug,
        })),
      },
      ...(config.faqs && config.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": config.faqs.map((faq: any) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a,
          }
        }))
      }] : []),
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GamesClient
        quizzes={quizzes}
        config={config}
        gameSlug={game}
        statsData={statsData}
        insights={insights}
        activeCodes={activeCodes}
      />
      {guide && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 16px" }}>
          <a href={`/guides/${guide.slug}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "linear-gradient(135deg, rgba(0,180,216,0.08), rgba(184,76,255,0.06))", border: "1px solid rgba(0,180,216,0.2)", borderRadius: 14, padding: "18px 24px", textDecoration: "none", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 28 }}>📖</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#00b4d8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Beginner's Guide</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{guide.title}</div>
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#00b4d8", whiteSpace: "nowrap" }}>Read Guide →</span>
          </a>
        </div>
      )}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 40px" }}>
        <RobuxCTA variant="card" />
      </div>
    </>
  );
}