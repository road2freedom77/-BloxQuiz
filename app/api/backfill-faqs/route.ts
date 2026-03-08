import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: quizzes, error: selectError } = await supabase
    .from("quizzes")
    .select("slug, title, game, difficulty, angle")
    .is("faqs", null)
    .limit(10);

  if (selectError) {
    return NextResponse.json({ error: "Select failed", details: selectError.message });
  }

  if (!quizzes || quizzes.length === 0) {
    return NextResponse.json({ done: true, message: "No quizzes need FAQs" });
  }

  const results: any[] = [];

  for (const quiz of quizzes) {
    try {
      const prompt = `Generate 4 unique FAQ entries for a Roblox ${quiz.game} quiz titled "${quiz.title}".
The quiz angle is "${quiz.angle}" and difficulty is "${quiz.difficulty}".

Return ONLY a valid JSON array with exactly 4 objects, no markdown, no explanation:
[
  {
    "question": "A specific question about this particular quiz topic",
    "answer": "A detailed 1-2 sentence answer that references specific ${quiz.game} content"
  }
]

Rules:
- Each FAQ must be specific to THIS quiz's topic and angle, not generic
- Each answer must mention specific ${quiz.game} game content (items, areas, mechanics, characters)
- Do NOT include FAQs about: number of questions, difficulty level, whether the quiz is free, or "how to improve" with generic advice
- Do NOT use generic answers like "Practice by playing more quizzes on BloxQuiz"
- Make FAQs that would genuinely help a ${quiz.game} player understand the topic better
- Return ONLY the JSON array, nothing else`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const rawText = await response.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        results.push({ slug: quiz.slug, status: "parse_error", raw: rawText.substring(0, 200) });
        continue;
      }

      const text = data.content?.[0]?.text?.trim();
      if (!text) {
        results.push({ slug: quiz.slug, status: "no_response", http_status: response.status, raw: JSON.stringify(data).substring(0, 200) });
        continue;
      }

      const clean = text.replace(/```json|```/g, "").trim();
      const faqs = JSON.parse(clean);

      if (!Array.isArray(faqs) || faqs.length === 0) {
        results.push({ slug: quiz.slug, status: "invalid_faqs" });
        continue;
      }

      const { data: updateData, error: updateError } = await supabase
        .from("quizzes")
        .update({ faqs })
        .eq("slug", quiz.slug)
        .select("slug");

      if (updateError) {
        results.push({ slug: quiz.slug, status: "update_failed", error: updateError.message });
      } else if (!updateData || updateData.length === 0) {
        results.push({ slug: quiz.slug, status: "no_rows_matched" });
      } else {
        results.push({ slug: quiz.slug, status: "success", faq_count: faqs.length });
      }
    } catch (error: any) {
      results.push({ slug: quiz.slug, status: "error", error: error.message });
    }
  }

  return NextResponse.json({
    processed: results.length,
    remaining: "run again if more quizzes need FAQs",
    results,
  });
}