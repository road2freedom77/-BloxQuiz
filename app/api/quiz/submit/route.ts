import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { slug, title, intro, game, difficulty, angle, questions, faqs, source } = await req.json();

    if (!slug || !title || !game || !questions?.length) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Format questions to match existing schema
    const formattedQuestions = questions.map((q: any, i: number) => ({
      id: i + 1,
      question: q.q,
      answers: {
        A: q.a[0],
        B: q.a[1],
        C: q.a[2],
        D: q.a[3],
      },
      correct: ["A", "B", "C", "D"][q.correct],
    }));

    const { error } = await supabase.from("quizzes").insert({
      slug,
      title,
      intro: intro || null,
      game,
      difficulty,
      angle: angle || null,
      questions: formattedQuestions,
      faqs: faqs?.filter((f: any) => f.question && f.answer) || [],
      source: source || "admin",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug });
  } catch (err: any) {
    console.error("Submit quiz error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}