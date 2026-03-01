import { supabase } from "../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "weekly";

  let dateFilter = new Date();
  if (period === "weekly") {
    dateFilter.setDate(dateFilter.getDate() - 7);
  } else {
    dateFilter = new Date("2000-01-01");
  }

  const { data, error } = await supabase
    .from("scores")
    .select(`
      user_id,
      score,
      total_questions,
      completed_at,
      users (
        username,
        xp
      )
    `)
    .gte("completed_at", dateFilter.toISOString())
    .order("score", { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });

  // Aggregate scores per user
  const userMap: Record<string, any> = {};
  for (const row of data || []) {
    const uid = row.user_id;
    if (!userMap[uid]) {
      userMap[uid] = {
        user_id: uid,
        username: (row.users as any)?.username || "Anonymous",
        xp: (row.users as any)?.xp || 0,
        total_score: 0,
        quizzes_played: 0,
      };
    }
    userMap[uid].total_score += row.score;
    userMap[uid].quizzes_played += 1;
  }

  const leaderboard = Object.values(userMap)
    .sort((a: any, b: any) => b.total_score - a.total_score)
    .slice(0, 10)
    .map((user: any, index: number) => ({
      rank: index + 1,
      ...user,
    }));

  return NextResponse.json({ leaderboard });
}