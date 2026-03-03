import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
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

const gameThumbs: Record<string, string> = {
  "Blox Fruits": "linear-gradient(135deg, #1a0a2e, #3d1a5c)",
  "Brookhaven RP": "linear-gradient(135deg, #0a1628, #1a3a5c)",
  "Adopt Me!": "linear-gradient(135deg, #2a1a0a, #5c3a1a)",
  "Tower of Hell": "linear-gradient(135deg, #0a1a0a, #1a3a1a)",
  "Murder Mystery 2": "linear-gradient(135deg, #1a0a0a, #3a1a1a)",
  "Grow a Garden": "linear-gradient(135deg, #0a1a0a, #1a3a1a)",
  "Royale High": "linear-gradient(135deg, #2a0a2e, #5c1a5c)",
  "Doors": "linear-gradient(135deg, #1a1a0a, #3a3a1a)",
  "Arsenal": "linear-gradient(135deg, #1a0a0a, #4a1a1a)",
  "Anime Fighting Simulator": "linear-gradient(135deg, #0a0a2e, #1a1a5c)",
  "Berry Avenue": "linear-gradient(135deg, #2a0a1a, #5c1a3a)",
  "Livetopia": "linear-gradient(135deg, #0a1a2a, #1a3a5c)",
  "Natural Disaster Survival": "linear-gradient(135deg, #1a1a0a, #4a3a0a)",
  "Anime Defenders": "linear-gradient(135deg, #0a0a1a, #1a1a4a)",
  "Funky Friday": "linear-gradient(135deg, #1a0a2a, #4a1a5c)",
  "Kick Off": "linear-gradient(135deg, #0a1a0a, #1a4a1a)",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "200");
  const game = searchParams.get("game") || null;

  const slugsSeen = new Set<string>();
  const allQuizzes: any[] = [];

  // Load JSON quizzes
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir).reverse();
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const content = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
      const slug = file.replace(".json", "");
      if (!slugsSeen.has(slug)) {
        allQuizzes.push({
          slug,
          title: content.title,
          game: content.game,
          difficulty: content.difficulty,
          questions: content.questions?.length || 10,
          emoji: gameEmojis[content.game] || "🎮",
          thumb: gameThumbs[content.game] || "linear-gradient(135deg, #1a1a2e, #3d1a5c)",
          source: "json",
        });
        slugsSeen.add(slug);
      }
    }
  } catch (e) {}

  // Load Supabase quizzes
  try {
    const { data } = await supabase
      .from("quizzes")
      .select("slug, title, game, difficulty, questions, published_at")
      .order("published_at", { ascending: false });

    if (data) {
      for (const q of data) {
        if (!slugsSeen.has(q.slug)) {
          allQuizzes.push({
            slug: q.slug,
            title: q.title,
            game: q.game,
            difficulty: q.difficulty,
            questions: Array.isArray(q.questions) ? q.questions.length : 10,
            emoji: gameEmojis[q.game] || "🎮",
            thumb: gameThumbs[q.game] || "linear-gradient(135deg, #1a1a2e, #3d1a5c)",
            source: "generated",
            published_at: q.published_at,
          });
          slugsSeen.add(q.slug);
        }
      }
    }
  } catch (e) {}

  // Add static quizzes not already included
  for (const q of staticQuizzes) {
    if (!slugsSeen.has(q.slug)) {
      allQuizzes.push({ ...q, source: "static" });
      slugsSeen.add(q.slug);
    }
  }

  let result = allQuizzes;
  if (game) {
    result = result.filter(q => q.game.toLowerCase().includes(game.toLowerCase()));
  }

  return NextResponse.json({ quizzes: result.slice(0, limit) });
}