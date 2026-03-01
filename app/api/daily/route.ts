import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import fs from "fs";
import path from "path";

export async function GET() {
  // Get all available quiz slugs
  const slugs: string[] = [];

  // Static quizzes
  const staticSlugs = [
    "blox-fruits-ultimate",
    "brookhaven-secrets",
    "adopt-me-pets",
    "which-roblox-game",
  ];
  slugs.push(...staticSlugs);

  // Dynamic quizzes
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      slugs.push(file.replace(".json", ""));
    }
  } catch (e) {}

  // Pick quiz deterministically by date seed
  const today = new Date().toISOString().split("T")[0];
  const seed = today.replace(/-/g, "");
  const index = parseInt(seed) % slugs.length;
  const dailySlug = slugs[index];

  // Load quiz data
  let quiz: any = null;
  try {
    const filePath = path.join(process.cwd(), `app/data/quizzes/${dailySlug}.json`);
    quiz = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    // Fallback to static
    const staticQuizzes: Record<string, any> = {
      "blox-fruits-ultimate": { title: "Ultimate Blox Fruits Expert Quiz", game: "Blox Fruits", difficulty: "Hard" },
      "brookhaven-secrets": { title: "Brookhaven Secrets You Didn't Know", game: "Brookhaven", difficulty: "Easy" },
      "adopt-me-pets": { title: "Name That Pet! — Adopt Me Edition", game: "Adopt Me!", difficulty: "Medium" },
      "which-roblox-game": { title: "Which Roblox Game Are You?", game: "All Games", difficulty: "Medium" },
    };
    quiz = staticQuizzes[dailySlug] || staticQuizzes["blox-fruits-ultimate"];
  }

  // Get today's play stats for this quiz
  const startOfDay = `${today}T00:00:00.000Z`;
  const { count: playedToday } = await supabase
    .from("plays")
    .select("*", { count: "exact", head: true })
    .eq("quiz_slug", dailySlug)
    .gte("played_at", startOfDay);

  const { data: scoresData } = await supabase
    .from("plays")
    .select("score, total_questions")
    .eq("quiz_slug", dailySlug)
    .gte("played_at", startOfDay);

  let avgScore = 0;
  let perfectCount = 0;
  if (scoresData && scoresData.length > 0) {
    const total = scoresData.reduce((sum, s) => sum + (s.score / s.total_questions) * 10, 0);
    avgScore = Math.round((total / scoresData.length) * 10) / 10;
    perfectCount = scoresData.filter(s => s.score === s.total_questions).length;
    const perfectPct = Math.round((perfectCount / scoresData.length) * 100);
    perfectCount = perfectPct;
  }

  return NextResponse.json({
    slug: dailySlug,
    title: quiz.title,
    game: quiz.game,
    difficulty: quiz.difficulty,
    date: today,
    stats: {
      playedToday: playedToday || 0,
      avgScore,
      perfectPct: perfectCount,
    }
  });
}