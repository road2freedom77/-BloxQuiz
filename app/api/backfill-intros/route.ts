// app/api/backfill-intros/route.ts
import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all quizzes missing an intro
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("slug, title, game, difficulty, angle")
    .is("intro", null)
    .limit(20); // process 20 at a time to avoid timeout

  if (!quizzes || quizzes.length === 0) {
    return NextResponse.json({ done: true, message: "No quizzes need intros" });
  }

  const results: any[] = [];

  for (const quiz of quizzes) {
    try {
      const prompt = `Write a 2-3 sentence intro paragraph for a Roblox ${quiz.game} quiz titled "${quiz.title}". 
The quiz angle is "${quiz.angle}" and difficulty is "${quiz.difficulty}".
Reference specific ${quiz.game} game mechanics, items, areas, or lore relevant to this angle.
Do NOT use generic phrases like "Test your knowledge" or "Can you get a perfect score".
Write it as if a fan is hyping up another player.
Return ONLY the intro text, no quotes, no markdown, nothing else.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const intro = data.content?.[0]?.text?.trim();

      if (intro) {
        await supabase
          .from("quizzes")
          .update({ intro })
          .eq("slug", quiz.slug);

        results.push({ slug: quiz.slug, status: "success" });
      } else {
        results.push({ slug: quiz.slug, status: "no_response" });
      }
    } catch (error: any) {
      results.push({ slug: quiz.slug, status: "error", error: error.message });
    }
  }

  return NextResponse.json({
    processed: results.length,
    remaining: "run again if more quizzes need intros",
    results,
  });
}
