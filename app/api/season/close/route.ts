import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "../../../lib/supabase";

const FALLBACK_SEASON_ID = "2214424b-d4c8-4d6e-8b01-b4ff719822b9";

export async function POST(req: Request) {
  try {
    const { seasonId: rawSeasonId } = await req.json();
    const seasonId = rawSeasonId || FALLBACK_SEASON_ID;
    console.log("[close-season] seasonId received:", rawSeasonId, "using:", seasonId);

    const currentMonth = new Date().toISOString().substring(0, 7);
    console.log("[close-season] currentMonth:", currentMonth);

    const { data: scores, error: scoresError } = await supabase
      .from("scores")
      .select("user_id, weighted_score, score, total_questions")
      .eq("month", currentMonth)
      .eq("is_first_attempt", true);

    if (scoresError) {
      console.error("[close-season] scores fetch error:", scoresError);
      return NextResponse.json({ success: false, error: scoresError.message });
    }

    console.log("[close-season] scores found:", scores?.length);

    if (!scores || scores.length === 0) {
      return NextResponse.json({ success: false, error: "No scores found for current month" });
    }

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

    console.log("[close-season] ranked players:", ranked.length);

    for (const p of ranked) {
      const { error: upsertError } = await supabase.from("season_results").upsert({
        season_id: seasonId,
        user_id: p.user_id,
        rank: p.rank,
        score: p.score,
        quizzes_completed: p.quizzes_completed,
        avg_accuracy: p.avg_accuracy,
        reward_status: p.rank <= 3 && p.qualifies ? "pending" : "expired",
      }, { onConflict: "season_id,user_id" });

      if (upsertError) {
        console.error("[close-season] upsert error for user", p.user_id, upsertError);
        return NextResponse.json({ success: false, error: upsertError.message });
      }
    }

    const { error: updateError } = await supabase.from("seasons")
      .update({ status: "closed" })
      .eq("id", seasonId);

    if (updateError) {
      console.error("[close-season] season update error:", updateError);
      return NextResponse.json({ success: false, error: updateError.message });
    }

    console.log("[close-season] success!");
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("[close-season] caught exception:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}