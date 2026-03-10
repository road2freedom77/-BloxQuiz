import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendNewQuizEmail } from "../../../lib/sendQuizEmail";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ success: false, error: "Missing slug" }, { status: 400 });
    }

    const { error } = await supabase
      .from("quizzes")
      .update({ status: "published" })
      .eq("slug", slug);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Fetch quiz details for email
    const { data: quiz } = await supabase
      .from("quizzes")
      .select("title, game, difficulty, intro")
      .eq("slug", slug)
      .single();

    if (quiz) {
      await sendNewQuizEmail({
        title: quiz.title,
        game: quiz.game,
        difficulty: quiz.difficulty,
        intro: quiz.intro,
        slug,
      }).catch(err => console.error("Email failed:", err));
    }

    return NextResponse.json({ success: true, slug });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}