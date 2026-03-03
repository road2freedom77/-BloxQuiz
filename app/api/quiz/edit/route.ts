import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const { slug, questionIndex, question, answers, correct } = await req.json();

  if (!slug || questionIndex === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), `app/data/quizzes/${slug}.json`);
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

    content.questions[questionIndex] = {
      ...content.questions[questionIndex],
      q: question,
      a: answers,
      correct,
    };

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}