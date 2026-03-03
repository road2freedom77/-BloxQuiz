import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req: Request) {
  const { slug, questionIndex, question, answers, correct } = await req.json();

  if (!slug || questionIndex === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabase
    .from("question_edits")
    .upsert({
      quiz_slug: slug,
      question_index: questionIndex,
      question,
      answers,
      correct,
    }, { onConflict: "quiz_slug,question_index" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}