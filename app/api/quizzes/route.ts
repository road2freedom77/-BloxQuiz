import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const staticQuizzes = [
  { slug: "blox-fruits-ultimate", title: "Ultimate Blox Fruits Expert Quiz", game: "Blox Fruits", difficulty: "Hard", questions: 10, emoji: "🍎⚔️🌊", thumb: "linear-gradient(135deg, #1a0a2e, #3d1a5c)" },
  { slug: "brookhaven-secrets", title: "Brookhaven Secrets You Didn't Know", game: "Brookhaven", difficulty: "Easy", questions: 10, emoji: "🏠🚗👨‍👩‍👧", thumb: "linear-gradient(135deg, #0a1628, #1a3a5c)" },
  { slug: "adopt-me-pets", title: "Name That Pet! — Adopt Me Edition", game: "Adopt Me!", difficulty: "Medium", questions: 10, emoji: "🐶🦄🥚✨", thumb: "linear-gradient(135deg, #2a1a0a, #5c3a1a)" },
  { slug: "which-roblox-game", title: "Which Roblox Game Are You?", game: "All Games", difficulty: "Medium", questions: 10, emoji: "🧠🎭❓", thumb: "linear-gradient(135deg, #0a2818, #1a5c3a)" },
];

const gameEmojis: Record<string, string> = {
  "Blox Fruits": "⚔️",
  "Brookhaven RP": "🏠",
  "Adopt Me!": "🐾",
  "Tower of Hell": "🗼",
  "Murder Mystery 2": "🔫",
  "Grow a Garden": "🌱",
};

const gameThumbs: Record<string, string> = {
  "Blox Fruits": "linear-gradient(135deg, #1a0a2e, #3d1a5c)",
  "Brookhaven RP": "linear-gradient(135deg, #0a1628, #1a3a5c)",
  "Adopt Me!": "linear-gradient(135deg, #2a1a0a, #5c3a1a)",
  "Tower of Hell": "linear-gradient(135deg, #0a1a0a, #1a3a1a)",
  "Murder Mystery 2": "linear-gradient(135deg, #1a0a0a, #3a1a1a)",
  "Grow a Garden": "linear-gradient(135deg, #0a1a0a, #1a3a1a)",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "8");
  const game = searchParams.get("game") || null;

  // Load dynamic quizzes
  const dynamicQuizzes: any[] = [];
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir);
    for (const file of files.reverse()) {
      if (!file.endsWith(".json")) continue;
      const content = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
      const slug = file.replace(".json", "");
      dynamicQuizzes.push({
        slug,
        title: content.title,
        game: content.game,
        difficulty: content.difficulty,
        questions: content.questions?.length || 10,
        emoji: gameEmojis[content.game] || "🎮",
        thumb: gameThumbs[content.game] || "linear-gradient(135deg, #1a1a2e, #3d1a5c)",
      });
    }
  } catch (e) {}

  let allQuizzes = [...dynamicQuizzes, ...staticQuizzes];

  if (game) {
    allQuizzes = allQuizzes.filter(q => q.game.toLowerCase().includes(game.toLowerCase()));
  }

  return NextResponse.json({ quizzes: allQuizzes.slice(0, limit) });
}