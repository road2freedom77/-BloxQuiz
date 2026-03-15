import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import fs from "fs";
import path from "path";

export async function GET() {
  const [
    { count: quizzesPlayed },
    { count: players },
    { count: generatedCount },
    { count: gamesCount },
  ] = await Promise.all([
    supabase.from("plays").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("quizzes").select("*", { count: "exact", head: true }),
    supabase.from("code_games").select("*", { count: "exact", head: true }),
  ]);

  const staticQuizzes = 4;
  let jsonQuizzes = 0;

  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith(".json"));
    jsonQuizzes = files.length;
  } catch (e) {}

  const totalQuizzes = staticQuizzes + jsonQuizzes + (generatedCount || 0);

  return NextResponse.json({
    quizzesPlayed: quizzesPlayed || 0,
    players: players || 0,
    totalQuizzes,
    gamesCovered: gamesCount || 19,
  });
}