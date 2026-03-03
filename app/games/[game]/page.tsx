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

function getDefaultEmoji(gameName: string) {
  return gameEmojis[gameName] || "🎮";
}

function slugToGame(): Record<string, { displayName: string, emoji: string, title: string, description: string }> {
  const result: Record<string, any> = {};
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith(".json"));
    for (const file of files) {
      const content = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
      const gameName: string = content.game;
      if (!gameName) continue;
      const slug = gameName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      if (!result[slug]) {
        result[slug] = {
          displayName: gameName,
          emoji: getDefaultEmoji(gameName),
          title: `${gameName} Quizzes — Test Your Knowledge | BloxQuiz`,
          description: `Think you know ${gameName}? Take free trivia quizzes and test your Roblox knowledge. Multiple difficulty levels available.`,
        };
      }
    }
  } catch (e) {}
  return result;
}

async function getQuizzesForGame(displayName: string) {
  const quizzes: any[] = [];
  const slugsSeen = new Set<string>();

  // JSON quizzes
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
          source: "static",
        });
        slugsSeen.add(slug);
      }
    }
  } catch (e) {}

  // Supabase quizzes
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
  };
}

export default async function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const gameMap = slugToGame();
  const config = gameMap[game];
  if (!config) notFound();

  const quizzes = await getQuizzesForGame(config.displayName);

  return <GamesClient quizzes={quizzes} config={config} gameSlug={game} />;
}