import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req: Request) {
  const { seasonId } = await req.json();
  const currentMonth = new Date().toISOString().substring(0, 7);

  const { data: scores } = await supabase
    .from("scores")
    .select("user_id, weighted_score, score, total_questions")
    .eq("month", currentMonth)
    .eq("is_first_attempt", true);

  if (!scores) return NextResponse.json({ success: false });

  const userMap: Record<string, any> = {};
  for (const row of scores) {
    if (!userMap[row.user_id]) {
      userMap[row.user_id] = { total: 0, quizzes: 0, correct: 0, total_questions: 0 };
    }
    userMap[row.user_id].total += row.weighted_score || 0;
    userMap[row.user_id].quizzes += 1;
    userMap[row.user_id].correct += row.score || 0;
    userMap[row.user_id].total_questions += row.total_questions || 0;
  }

  const ranked = Object.entries(userMap)
    .map(([uid, d]: any) => ({
      user_id: uid,
      score: d.total,
      quizzes_completed: d.quizzes,
      avg_accuracy: d.total_questions > 0
        ? Math.round((d.correct / d.total_questions) * 100)
        : 0,
      qualifies: d.quizzes >= 10,
    }))
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  for (const p of ranked) {
    await supabase.from("season_results").upsert({
      season_id: seasonId,
      user_id: p.user_id,
      rank: p.rank,
      score: p.score,
      quizzes_completed: p.quizzes_completed,
      avg_accuracy: p.avg_accuracy,
      reward_status: p.rank <= 10 && p.qualifies ? "pending" : "expired",
    }, { onConflict: "season_id,user_id" });
  }

  await supabase.from("seasons")
    .update({ status: "closed" })
    .eq("id", seasonId);

  return NextResponse.json({ success: true });
}