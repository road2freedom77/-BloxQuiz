import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { supabase } from "../../lib/supabase";
import GamesClient from "./GamesClient";

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
};

const gameIntros: Record<string, string> = {
  "Blox Fruits": "Blox Fruits is one of the most popular Roblox games ever made, with billions of visits and a dedicated global playerbase. Set across three seas filled with islands, bosses, and powerful Devil Fruits, the game rewards players who master combat, progression, and trading. From choosing your first fruit to awakening legendary abilities and grinding for mastery, there's always something new to learn. Our Blox Fruits quizzes cover every aspect of the game — from beginner mechanics and fruit stats to expert awakening requirements, trading values, and hidden secrets. Whether you're a new pirate or a seasoned Sea 3 grinder, test your knowledge and see how you stack up.",
  "Brookhaven RP": "Brookhaven RP is one of Roblox's most beloved roleplay experiences, attracting millions of players who love its open-world suburban setting. From hidden underground bunkers to secret vehicles and interactive locations, Brookhaven is packed with details that most players never discover. Our quizzes cover the full Brookhaven experience — from basic locations and game mechanics to advanced secrets, vehicle knowledge, and roleplay scenarios. Whether you're a casual player or a Brookhaven expert who knows every hidden corner, our trivia will put your knowledge to the test.",
  "Adopt Me!": "Adopt Me! revolutionized Roblox with its pet trading economy, creating one of the most complex and valuable virtual marketplaces in gaming history. With hundreds of pets across dozens of eggs, legendary rarities, neon transformations, and a constantly evolving trading scene, there's an enormous amount of knowledge to master. Our quizzes test everything from basic pet mechanics and egg types to advanced trading values, legendary pet histories, and limited-time event knowledge. Whether you're a new player learning the ropes or a seasoned trader who knows every pet value, our Adopt Me quizzes will challenge you.",
  "Tower of Hell": "Tower of Hell is the ultimate test of Roblox parkour skill, challenging players to climb procedurally generated towers of obstacles without checkpoints. With its brutal difficulty, unique modifiers, and competitive multiplayer format, it has built one of Roblox's most dedicated fanbases. Our quizzes cover everything from basic obstacle types and tower mechanics to advanced modifier knowledge, section strategies, and game records. Think you know Tower of Hell inside and out? Prove it with our trivia challenges.",
  "Murder Mystery 2": "Murder Mystery 2 is a Roblox classic that has stood the test of time with its tense gameplay, deep weapon collection system, and active trading community. With hundreds of knives, guns, and godly weapons, plus a complex trading economy and seasonal events, MM2 rewards dedicated players with deep knowledge. Our quizzes cover all aspects of MM2 — from basic gameplay roles and map knowledge to advanced weapon values, godly item histories, and trading strategies. Whether you're an innocent, sheriff, or murderer at heart, test your MM2 knowledge here.",
  "Grow a Garden": "Grow a Garden is one of Roblox's fastest-growing simulation games, combining relaxing farming gameplay with surprisingly deep mechanics around rare mutations, crop values, and seasonal events. Players spend hours optimizing their gardens, hunting for rare seeds, and mastering the game's hidden systems. Our quizzes cover everything from basic planting mechanics to advanced mutation triggers, rare crop identification, and tool optimization. How well do you really know your garden?",
  "Royale High": "Royale High is Roblox's premier fantasy roleplay and dress-up experience, beloved for its stunning realms, seasonal halos, and deep trading economy. With hundreds of collectible accessories, diamond-earning strategies, and limited-time event rewards, Royale High has one of the most passionate communities on Roblox. Our quizzes test your knowledge of realms, halos, trading values, seasonal events, and hidden game secrets. Are you a true Royale High royalty?",
  "Doors": "Doors is one of Roblox's most thrilling horror experiences, sending players through procedurally generated hotel floors filled with terrifying entities, hidden items, and deadly traps. With a deep lore system, multiple floors, and a dedicated community of speedrunners and secret hunters, Doors rewards players who study its mechanics carefully. Our quizzes cover all entities, item uses, floor strategies, and hidden secrets. Do you have what it takes to survive?",
  "Arsenal": "Arsenal is Roblox's most popular first-person shooter, combining fast-paced gunplay with a massive weapon progression system. With dozens of maps, killstreak rewards, and seasonal content, Arsenal has built a competitive community that demands sharp reflexes and deep game knowledge. Our quizzes cover weapons, maps, game modes, characters, and advanced combat mechanics. Think you're a top Arsenal player? Prove it.",
  "Anime Fighting Simulator": "Anime Fighting Simulator brings the world of anime to Roblox with an enormous roster of transformations, stands, quirks, and training zones inspired by the biggest anime series. With constant updates adding new abilities and benchmarks, there's always more to master. Our quizzes cover everything from basic training mechanics to advanced stand abilities, transformation requirements, and benchmark milestones. How deep is your anime knowledge?",
  "Berry Avenue": "Berry Avenue is one of Roblox's most popular roleplay games, offering a rich suburban world filled with jobs, vehicles, interactive locations, and social scenarios. Its detailed world and regular updates keep millions of players coming back. Our quizzes test your knowledge of Berry Avenue's locations, activities, vehicles, and hidden features. How well do you know the avenue?",
  "Livetopia": "Livetopia is a vibrant Roblox roleplay experience packed with activities, jobs, vehicles, and social spaces that keep players engaged for hours. With its colorful world and regular content updates, it has grown into one of the platform's most visited games. Our quizzes cover Livetopia's locations, mechanics, vehicles, and secrets. Are you a true Livetopia local?",
  "Natural Disaster Survival": "Natural Disaster Survival is a Roblox classic that has tested players' quick thinking and survival instincts for years. With a variety of disasters from earthquakes to alien invasions, each round demands different strategies and map knowledge. Our quizzes cover all disaster types, survival strategies, map features, and game mechanics. Can you survive every disaster?",
  "Anime Defenders": "Anime Defenders is one of Roblox's most popular tower defense games, featuring hundreds of units inspired by iconic anime series. With complex evolution chains, trait systems, and stage mechanics, mastering Anime Defenders requires serious dedication. Our quizzes cover unit stats, evolution requirements, summon mechanics, trait combinations, and stage strategies. How well do you know your defenders?",
  "Funky Friday": "Funky Friday is Roblox's most popular rhythm game, featuring a massive library of songs, competitive battles, and a deep ranking system. With its active community and regular song additions, there's always new content to master. Our quizzes test your knowledge of songs, arrow patterns, characters, ranks, and game mechanics. Do you have the rhythm?",
  "Kick Off": "Kick Off brings the excitement of football to Roblox with team-based matches, skill moves, power shots, and competitive tournaments. With its growing community and regular updates, it has become one of Roblox's top sports games. Our quizzes cover teams, mechanics, skills, tactics, and tournament knowledge. Are you a true Kick Off champion?",
};

const relatedGames: Record<string, string[]> = {
  "Blox Fruits": ["Murder Mystery 2", "Anime Defenders", "Arsenal"],
  "Brookhaven RP": ["Berry Avenue", "Livetopia", "Adopt Me!"],
  "Adopt Me!": ["Royale High", "Brookhaven RP", "Grow a Garden"],
  "Tower of Hell": ["Arsenal", "Funky Friday", "Natural Disaster Survival"],
  "Murder Mystery 2": ["Arsenal", "Blox Fruits", "Doors"],
  "Grow a Garden": ["Adopt Me!", "Livetopia", "Berry Avenue"],
  "Royale High": ["Adopt Me!", "Berry Avenue", "Brookhaven RP"],
  "Doors": ["Murder Mystery 2", "Natural Disaster Survival", "Arsenal"],
  "Arsenal": ["Murder Mystery 2", "Tower of Hell", "Kick Off"],
  "Anime Fighting Simulator": ["Anime Defenders", "Blox Fruits", "Arsenal"],
  "Berry Avenue": ["Brookhaven RP", "Livetopia", "Royale High"],
  "Livetopia": ["Berry Avenue", "Brookhaven RP", "Adopt Me!"],
  "Natural Disaster Survival": ["Doors", "Tower of Hell", "Arsenal"],
  "Anime Defenders": ["Anime Fighting Simulator", "Blox Fruits", "Doors"],
  "Funky Friday": ["Tower of Hell", "Arsenal", "Kick Off"],
  "Kick Off": ["Arsenal", "Funky Friday", "Tower of Hell"],
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
};

function slugToGame(): Record<string, { displayName: string, emoji: string, title: string, description: string, intro: string, related: string[] }> {
  const result: Record<string, any> = {};
  for (const [gameName, slug] of Object.entries(gameSlugMap)) {
    result[slug] = {
      displayName: gameName,
      emoji: gameEmojis[gameName] || "🎮",
      title: `${gameName} Quizzes — Test Your Knowledge | BloxQuiz`,
      description: `Think you know ${gameName}? Take free trivia quizzes and test your Roblox knowledge. Multiple difficulty levels available on BloxQuiz.gg`,
      intro: gameIntros[gameName] || `Test your ${gameName} knowledge with free trivia quizzes on BloxQuiz.`,
      related: relatedGames[gameName] || [],
    };
  }
  return result;
}

async function getQuizzesForGame(displayName: string) {
  const quizzes: any[] = [];
  const slugsSeen = new Set<string>();

  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const content = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
      const slug = file.replace(".json", "");
      const matches =
        content.game.toLowerCase().includes(displayName.toLowerCase()) ||
        displayName.toLowerCase().includes(content.game.toLowerCase());
      if (matches && !slugsSeen.has(slug)) {
        quizzes.push({
          slug,
          title: content.title,
          game: content.game,
          difficulty: content.difficulty,
          questions: content.questions?.length || 10,
          angle: content.angle || null,
          source: "static",
        });
        slugsSeen.add(slug);
      }
    }
  } catch (e) {}

  try {
    const { data } = await supabase
      .from("quizzes")
      .select("slug, title, game, difficulty, questions, angle")
      .eq("game", displayName)
      .order("published_at", { ascending: false });

    if (data) {
      for (const q of data) {
        if (!slugsSeen.has(q.slug)) {
          quizzes.push({
            slug: q.slug,
            title: q.title,
            game: q.game,
            difficulty: q.difficulty,
            questions: Array.isArray(q.questions) ? q.questions.length : 10,
            angle: q.angle,
            source: "generated",
          });
          slugsSeen.add(q.slug);
        }
      }
    }
  } catch (e) {}

  return quizzes;
}

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const config = slugToGame()[game];
  if (!config) return {};
  return {
    title: config.title,
    description: config.description,
    alternates: { canonical: `https://www.bloxquiz.gg/games/${game}` },
    openGraph: {
      title: config.title,
      description: config.description,
      url: `https://www.bloxquiz.gg/games/${game}`,
      siteName: "BloxQuiz",
      type: "website",
    },
  };
}

export default async function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const gameMap = slugToGame();
  const config = gameMap[game];
  if (!config) notFound();

  const quizzes = await getQuizzesForGame(config.displayName);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bloxquiz.gg" },
          { "@type": "ListItem", "position": 2, "name": "Games", "item": "https://www.bloxquiz.gg/browse" },
          { "@type": "ListItem", "position": 3, "name": `${config.displayName} Quizzes`, "item": `https://www.bloxquiz.gg/games/${game}` },
        ]
      },
      {
        "@type": "CollectionPage",
        "@id": `https://www.bloxquiz.gg/games/${game}`,
        "url": `https://www.bloxquiz.gg/games/${game}`,
        "name": `${config.displayName} Quizzes | BloxQuiz`,
        "description": config.description,
        "inLanguage": "en-US",
        "hasPart": quizzes.slice(0, 10).map(q => ({
          "@type": "Quiz",
          "name": q.title,
          "url": `https://www.bloxquiz.gg/quiz/${q.slug}`,
        })),
      },
      {
        "@type": "ItemList",
        "name": `${config.displayName} Quizzes`,
        "itemListElement": quizzes.slice(0, 10).map((q, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": q.title,
          "url": `https://www.bloxquiz.gg/quiz/${q.slug}`,
        })),
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GamesClient quizzes={quizzes} config={config} gameSlug={game} />
    </>
  );
}