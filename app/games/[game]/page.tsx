import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import GamesClient from "./GamesClient";

const gameConfig: Record<string, { title: string, description: string, emoji: string, displayName: string }> = {
  "blox-fruits": {
    displayName: "Blox Fruits",
    title: "Blox Fruits Quizzes — Test Your Knowledge | BloxQuiz",
    description: "How well do you know Blox Fruits? Take trivia quizzes on fruits, combat, seas, bosses and more. Easy, Medium and Hard difficulty levels.",
    emoji: "⚔️"
  },
  "brookhaven": {
    displayName: "Brookhaven RP",
    title: "Brookhaven RP Quizzes — Test Your Knowledge | BloxQuiz",
    description: "Think you know Brookhaven RP? Quiz yourself on locations, secrets, vehicles and roleplay scenarios. Free Roblox trivia.",
    emoji: "🏠"
  },
  "adopt-me": {
    displayName: "Adopt Me!",
    title: "Adopt Me! Quizzes — Pet Trivia & Knowledge Test | BloxQuiz",
    description: "Test your Adopt Me knowledge! Quizzes on pets, eggs, trading values and legendary rarities. Can you get a perfect score?",
    emoji: "🐾"
  },
  "tower-of-hell": {
    displayName: "Tower of Hell",
    title: "Tower of Hell Quizzes — Test Your Knowledge | BloxQuiz",
    description: "How much do you know about Tower of Hell? Quiz yourself on stages, mechanics, records and more.",
    emoji: "🗼"
  },
  "murder-mystery-2": {
    displayName: "Murder Mystery 2",
    title: "Murder Mystery 2 Quizzes — MM2 Trivia | BloxQuiz",
    description: "Think you're an MM2 expert? Test your knowledge on knives, guns, maps and strategies in our Murder Mystery 2 quizzes.",
    emoji: "🔫"
  },
  "grow-a-garden": {
    displayName: "Grow a Garden",
    title: "Grow a Garden Quizzes — Test Your Knowledge | BloxQuiz",
    description: "How well do you know Grow a Garden? Test yourself on plants, seeds, tools and harvesting mechanics.",
    emoji: "🌱"
  },
};

function getQuizzesForGame(displayName: string) {
  const staticQuizzes = [
    { slug: "blox-fruits-ultimate", title: "Ultimate Blox Fruits Expert Quiz", game: "Blox Fruits", difficulty: "Hard", questions: 10 },
    { slug: "brookhaven-secrets", title: "Brookhaven Secrets You Didn't Know", game: "Brookhaven", difficulty: "Easy", questions: 10 },
    { slug: "adopt-me-pets", title: "Name That Pet! — Adopt Me Edition", game: "Adopt Me!", difficulty: "Medium", questions: 10 },
    { slug: "which-roblox-game", title: "Which Roblox Game Are You?", game: "All Games", difficulty: "Medium", questions: 10 },
  ];

  const dynamicQuizzes: any[] = [];
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const content = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
      dynamicQuizzes.push({
        slug: file.replace(".json", ""),
        title: content.title,
        game: content.game,
        difficulty: content.difficulty,
        questions: content.questions?.length || 10,
      });
    }
  } catch (e) {}

  return [...dynamicQuizzes, ...staticQuizzes].filter(q =>
    q.game.toLowerCase().includes(displayName.toLowerCase()) ||
    displayName.toLowerCase().includes(q.game.toLowerCase())
  );
}

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const config = gameConfig[game];
  if (!config) return {};
  return {
    title: config.title,
    description: config.description,
  };
}

export default async function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const config = gameConfig[game];
  if (!config) notFound();

  const quizzes = getQuizzesForGame(config.displayName);

  return <GamesClient quizzes={quizzes} config={config} gameSlug={game} />;
}