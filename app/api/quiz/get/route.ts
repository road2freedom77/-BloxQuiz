import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) return NextResponse.json({ error: "No slug" }, { status: 400 });

  // Try JSON first
  try {
    const filePath = path.join(process.cwd(), `app/data/quizzes/${slug}.json`);
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return NextResponse.json(content);
  } catch (e) {}

  // Fall back to Supabase
  try {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    return NextResponse.json({
      title: data.title,
      game: data.game,
      difficulty: data.difficulty,
      angle: data.angle,
      questions: data.questions,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}