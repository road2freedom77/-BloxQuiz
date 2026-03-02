import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import fs from "fs";
import path from "path";

export async function GET() {
  const { count: quizzesPlayed } = await supabase
    .from("plays")
    .select("*", { count: "exact", head: true });

  const { count: players } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const staticQuizzes = 4;
  let dynamicQuizzes = 0;
  const gameSet = new Set<string>();

  try {
    const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
    const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith(".json"));
    dynamicQuizzes = files.length;
    for (const file of files) {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), "utf8"));
        if (content.game) gameSet.add(content.game);
      } catch (e) {}
    }
  } catch (e) {}

  const totalQuizzes = staticQuizzes + dynamicQuizzes;

  return NextResponse.json({
    quizzesPlayed: quizzesPlayed || 0,
    players: players || 0,
    totalQuizzes,
    gamesCovered: gameSet.size || 16,
  });
}