import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import fs from "fs";
import path from "path";

export async function GET() {
  // Get total scores (quizzes played)
  const { count: quizzesPlayed } = await supabase
    .from("scores")
    .select("*", { count: "exact", head: true });

  // Get total users (players)
  const { count: players } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // Count actual quizzes
  const staticQuizzes = 4;
  let dynamicQuizzes = 0;
  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir);
    dynamicQuizzes = files.filter(f => f.endsWith(".json")).length;
  } catch (e) {}

  const totalQuizzes = staticQuizzes + dynamicQuizzes;

  return NextResponse.json({
    quizzesPlayed: quizzesPlayed || 0,
    players: players || 0,
    totalQuizzes,
    gamesCovered: 6,
  });
}