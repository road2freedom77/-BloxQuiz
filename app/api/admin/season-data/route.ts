import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase, supabaseAdmin } from "../../../lib/supabase";

const ADMIN_USER_IDS = [
  "user_3ALlHJlXwNoezsy7eoC7qAp6yTO",
  "user_3AM3VzXy7LGvyivPbtHeNak7BDT",
  "user_3APPYs0LjMfWCIt6lBfIiYyVteU",
  "user_3AjIcCtvCn5wdcF1RPZEhGV1RFj",
];

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const seasonId = searchParams.get("seasonId");
  const startDate = searchParams.get("startDate");

  if (!seasonId || !startDate) {
    return NextResponse.json({ error: "Missing seasonId or startDate" }, { status: 400 });
  }

  const seasonMonth = startDate.substring(0, 7);

  // Fetch scores for this season's month
  const { data: scores } = await supabase
    .from("scores")
    .select("user_id, weighted_score, score, total_questions")
    .eq("month", seasonMonth)
    .eq("is_first_attempt", true);

  const standings: any[] = [];

  if (scores && scores.length > 0) {
    const userMap: Record<string, any> = {};
    for (const row of scores) {
      if (!userMap[row.user_id]) userMap[row.user_id] = { total_score: 0, quizzes: 0, correct: 0, total_questions: 0 };
      userMap[row.user_id].total_score += row.weighted_score || 0;
      userMap[row.user_id].quizzes += 1;
      userMap[row.user_id].correct += row.score || 0;
      userMap[row.user_id].total_questions += row.total_questions || 0;
    }

    const userIds = Object.keys(userMap);
    const { data: users } = await supabase.from("users").select("id, username, streak, is_flagged, disqualified").in("id", userIds);
    const usersById: Record<string, any> = {};
    for (const u of users || []) usersById[u.id] = u;

    const { data: results } = await supabase
      .from("season_results")
      .select("user_id, reward_status, rank")
      .eq("season_id", seasonId)
      .in("user_id", userIds);
    const rewardByUser: Record<string, string> = {};
    for (const r of results || []) rewardByUser[r.user_id] = r.reward_status;

    const ranked = userIds
      .map(uid => ({
        user_id: uid,
        username: usersById[uid]?.username || "Unknown",
        streak: usersById[uid]?.streak || 0,
        is_flagged: usersById[uid]?.is_flagged || false,
        disqualified: usersById[uid]?.disqualified || false,
        monthly_score: userMap[uid].total_score,
        quizzes_completed: userMap[uid].quizzes,
        avg_accuracy: userMap[uid].total_questions > 0 ? Math.round((userMap[uid].correct / userMap[uid].total_questions) * 100) : 0,
        qualifies: userMap[uid].quizzes >= 10,
        reward_status: rewardByUser[uid] || "pending",
      }))
      .sort((a, b) => b.monthly_score - a.monthly_score)
      .map((p, i) => ({ ...p, rank: i + 1 }));

    standings.push(...ranked);
  }

  // Fetch prize claims for this season
  const { data: rawClaims } = await supabaseAdmin
    .from("prize_claims")
    .select("id, user_id, season_id, roblox_username, email, discord, status, submitted_at")
    .eq("season_id", seasonId)
    .order("submitted_at", { ascending: false });

  const claims: any[] = [];
  if (rawClaims && rawClaims.length > 0) {
    const userIds = rawClaims.map(c => c.user_id);
    const { data: users } = await supabaseAdmin.from("users").select("id, username").in("id", userIds);
    const usersById: Record<string, any> = {};
    for (const u of users || []) usersById[u.id] = u;

    const { data: results } = await supabaseAdmin
      .from("season_results")
      .select("user_id, rank")
      .eq("season_id", seasonId)
      .in("user_id", userIds);
    const rankByUser: Record<string, number> = {};
    for (const r of results || []) rankByUser[r.user_id] = r.rank;

    claims.push(...rawClaims.map(c => ({
      ...c,
      username: usersById[c.user_id]?.username || "Unknown",
      rank: rankByUser[c.user_id] || null,
    })));
  }

  return NextResponse.json({ standings, claims });
}